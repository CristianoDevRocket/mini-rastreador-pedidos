package com.rastreador.pedidos.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ItemRequest(
        @NotBlank String descricao,
        @NotNull @Min(1) Integer quantidade
) {
}
