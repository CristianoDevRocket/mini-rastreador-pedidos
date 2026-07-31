package com.rastreador.pedidos.service;

import com.rastreador.pedidos.dto.request.ItemRequest;
import com.rastreador.pedidos.dto.request.PedidoRequest;
import com.rastreador.pedidos.dto.request.StatusUpdateRequest;
import com.rastreador.pedidos.dto.response.PedidoResponse;
import com.rastreador.pedidos.entity.Pedido;
import com.rastreador.pedidos.enums.StatusPedido;
import com.rastreador.pedidos.exception.BusinessException;
import com.rastreador.pedidos.exception.ResourceNotFoundException;
import com.rastreador.pedidos.mapper.PedidoMapper;
import com.rastreador.pedidos.repository.PedidoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    private PedidoService pedidoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        pedidoService = new PedidoService(pedidoRepository, new PedidoMapper());
    }

    private Pedido criarPedidoComStatus(StatusPedido status) {
        Pedido pedido = Pedido.builder()
                .id(1L)
                .cliente("Cliente Teste")
                .enderecoEntrega("Rua Teste, 1")
                .status(status)
                .build();
        pedido.adicionarItem(com.rastreador.pedidos.entity.ItemPedido.builder()
                .descricao("Item")
                .quantidade(1)
                .build());
        return pedido;
    }

    @Test
    void criar_devePersistirPedidoComStatusRecebido() {
        PedidoRequest request = new PedidoRequest(
                "Cliente", "Rua A, 1", List.of(new ItemRequest("Pizza", 2)));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(inv -> {
            Pedido pedido = inv.getArgument(0);
            pedido.setId(1L);
            return pedido;
        });

        PedidoResponse response = pedidoService.criar(request);

        assertThat(response.status()).isEqualTo(StatusPedido.RECEBIDO);
        assertThat(response.itens()).hasSize(1);
    }

    @ParameterizedTest
    @CsvSource({
            "RECEBIDO, EM_PREPARO",
            "RECEBIDO, CANCELADO",
            "EM_PREPARO, SAIU_PARA_ENTREGA",
            "EM_PREPARO, CANCELADO",
            "SAIU_PARA_ENTREGA, ENTREGUE",
            "SAIU_PARA_ENTREGA, CANCELADO",
    })
    void atualizarStatus_transicaoValida_deveAtualizar(StatusPedido de, StatusPedido para) {
        Pedido pedido = criarPedidoComStatus(de);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        PedidoResponse response = pedidoService.atualizarStatus(1L, new StatusUpdateRequest(para));

        assertThat(response.status()).isEqualTo(para);
    }

    @ParameterizedTest
    @CsvSource({
            "RECEBIDO, ENTREGUE",
            "RECEBIDO, SAIU_PARA_ENTREGA",
            "EM_PREPARO, RECEBIDO",
            "EM_PREPARO, ENTREGUE",
            "ENTREGUE, EM_PREPARO",
            "CANCELADO, EM_PREPARO",
    })
    void atualizarStatus_transicaoInvalida_deveLancarBusinessException(StatusPedido de, StatusPedido para) {
        Pedido pedido = criarPedidoComStatus(de);
        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedido));

        assertThatThrownBy(() -> pedidoService.atualizarStatus(1L, new StatusUpdateRequest(para)))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void atualizarStatus_pedidoInexistente_deveLancarResourceNotFoundException() {
        when(pedidoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                pedidoService.atualizarStatus(99L, new StatusUpdateRequest(StatusPedido.EM_PREPARO)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void buscarPorId_inexistente_deveLancarResourceNotFoundException() {
        when(pedidoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> pedidoService.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void listarTodos_deveRetornarTodosPedidosMapeados() {
        when(pedidoRepository.findAll()).thenReturn(List.of(
                criarPedidoComStatus(StatusPedido.RECEBIDO),
                criarPedidoComStatus(StatusPedido.ENTREGUE)));

        List<PedidoResponse> resultado = pedidoService.listarTodos();

        assertThat(resultado).hasSize(2);
    }
}
