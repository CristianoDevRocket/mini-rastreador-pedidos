package com.rastreador.pedidos.dto.response;

import java.time.Instant;

public record ErrorResponse(
        Instant timestamp,
        int status,
        String message,
        String path
) {
    public ErrorResponse(int status, String message, String path) {
        this(Instant.now(), status, message, path);
    }
}
