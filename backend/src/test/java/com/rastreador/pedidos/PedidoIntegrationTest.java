package com.rastreador.pedidos;

import com.rastreador.pedidos.dto.request.ItemRequest;
import com.rastreador.pedidos.dto.request.LoginRequest;
import com.rastreador.pedidos.dto.request.PedidoRequest;
import com.rastreador.pedidos.dto.request.RegisterRequest;
import com.rastreador.pedidos.dto.request.StatusUpdateRequest;
import com.rastreador.pedidos.dto.response.LoginResponse;
import com.rastreador.pedidos.dto.response.PagedResponse;
import com.rastreador.pedidos.dto.response.PedidoResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PedidoIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private String baseUrl() {
        return "http://localhost:" + port;
    }

    private String registrarELogar(String email) {
        restTemplate.postForEntity(
                baseUrl() + "/auth/register",
                new RegisterRequest("Usuário Teste", email, "123456"),
                Void.class);

        ResponseEntity<LoginResponse> loginResponse = restTemplate.postForEntity(
                baseUrl() + "/auth/login",
                new LoginRequest(email, "123456"),
                LoginResponse.class);

        return loginResponse.getBody().token();
    }

    private HttpHeaders headersComToken(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    @Test
    void fluxoCompleto_criarListarEAtualizarStatusDoPedido() {
        String token = registrarELogar("integracao@teste.com");

        PedidoRequest pedidoRequest = new PedidoRequest(
                "Cliente Integração", "Rua dos Testes, 100", List.of(new ItemRequest("Pizza", 1)));
        HttpEntity<PedidoRequest> criarRequest = new HttpEntity<>(pedidoRequest, headersComToken(token));

        ResponseEntity<PedidoResponse> criarResponse = restTemplate.postForEntity(
                baseUrl() + "/pedidos", criarRequest, PedidoResponse.class);

        assertThat(criarResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        Long pedidoId = criarResponse.getBody().id();

        ResponseEntity<PagedResponse<PedidoResponse>> listaResponse = restTemplate.exchange(
                baseUrl() + "/pedidos", HttpMethod.GET, new HttpEntity<>(headersComToken(token)),
                new ParameterizedTypeReference<>() {});
        assertThat(listaResponse.getBody().content()).isNotEmpty();

        HttpEntity<StatusUpdateRequest> statusRequest = new HttpEntity<>(
                new StatusUpdateRequest(com.rastreador.pedidos.enums.StatusPedido.EM_PREPARO),
                headersComToken(token));

        ResponseEntity<PedidoResponse> statusResponse = restTemplate.exchange(
                baseUrl() + "/pedidos/" + pedidoId + "/status", HttpMethod.PATCH, statusRequest, PedidoResponse.class);

        assertThat(statusResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(statusResponse.getBody().status()).isEqualTo(com.rastreador.pedidos.enums.StatusPedido.EM_PREPARO);
    }

    @Test
    void acessoSemToken_deveRetornarNaoAutorizado() {
        ResponseEntity<String> response = restTemplate.getForEntity(baseUrl() + "/pedidos", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }
}
