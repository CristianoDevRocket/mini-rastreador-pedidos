package com.rastreador.pedidos.dto.response;

public record LoginResponse(
        String token,
        String tipo
) {
    public LoginResponse(String token) {
        this(token, "Bearer");
    }
}
