package com.rastreador.pedidos.dto.response;

import com.rastreador.pedidos.enums.StatusPedido;

import java.time.Instant;
import java.util.List;

public record PedidoResponse(
        Long id,
        String cliente,
        String enderecoEntrega,
        StatusPedido status,
        List<ItemResponse> itens,
        Instant createdAt
) {
}
