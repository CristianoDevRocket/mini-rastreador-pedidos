package com.rastreador.pedidos.service;

import com.rastreador.pedidos.dto.request.LoginRequest;
import com.rastreador.pedidos.dto.request.RegisterRequest;
import com.rastreador.pedidos.dto.response.LoginResponse;
import com.rastreador.pedidos.dto.response.UserResponse;
import com.rastreador.pedidos.entity.User;
import com.rastreador.pedidos.exception.BusinessException;
import com.rastreador.pedidos.mapper.UserMapper;
import com.rastreador.pedidos.repository.UserRepository;
import com.rastreador.pedidos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Já existe um usuário cadastrado com este e-mail");
        }

        User user = User.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .build();

        return userMapper.toResponse(userRepository.save(user));
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        return new LoginResponse(jwtService.generateToken(userDetails));
    }
}
