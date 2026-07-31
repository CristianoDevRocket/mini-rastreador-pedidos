package com.rastreador.pedidos.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record PedidoRequest(
        @NotBlank String cliente,
        @NotBlank String enderecoEntrega,
        @NotEmpty @Valid List<ItemRequest> itens
) {
}
