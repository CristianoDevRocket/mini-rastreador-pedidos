package com.rastreador.pedidos.dto.request;

import com.rastreador.pedidos.enums.StatusPedido;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull StatusPedido status
) {
}
