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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService(
                userRepository, passwordEncoder, authenticationManager, userDetailsService, jwtService, new UserMapper());
    }

    @Test
    void register_emailJaCadastrado_deveLancarBusinessException() {
        RegisterRequest request = new RegisterRequest("Nome", "existente@teste.com", "123456");
        when(userRepository.existsByEmail("existente@teste.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void register_emailNovo_deveCodificarSenhaESalvar() {
        RegisterRequest request = new RegisterRequest("Nome", "novo@teste.com", "123456");
        when(userRepository.existsByEmail("novo@teste.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("hash-da-senha");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User user = inv.getArgument(0);
            user.setId(1L);
            return user;
        });

        UserResponse response = authService.register(request);

        assertThat(response.email()).isEqualTo("novo@teste.com");
        verify(passwordEncoder).encode("123456");
    }

    @Test
    void login_credenciaisValidas_deveRetornarToken() {
        LoginRequest request = new LoginRequest("user@teste.com", "123456");
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("user@teste.com").password("hash").authorities("USER").build();

        when(userDetailsService.loadUserByUsername("user@teste.com")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token-gerado");

        LoginResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("jwt-token-gerado");
        assertThat(response.tipo()).isEqualTo("Bearer");
    }
}
