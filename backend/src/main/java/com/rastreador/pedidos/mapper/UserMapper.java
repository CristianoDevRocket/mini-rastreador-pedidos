package com.rastreador.pedidos.mapper;

import com.rastreador.pedidos.dto.response.UserResponse;
import com.rastreador.pedidos.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getNome(), user.getEmail());
    }
}
