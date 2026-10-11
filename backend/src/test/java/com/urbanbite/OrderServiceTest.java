package com.urbanbite;

import com.urbanbite.controller.AuthController;
import com.urbanbite.dto.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class OrderServiceTest {

    @Autowired
    private AuthController authController;

    @Test
    void testAuthControllerWiring() {
        assertNotNull(authController);
    }

    @Test
    void testDefaultAdminLogin() {
        LoginRequest request = LoginRequest.builder()
                .email("admin@urbanbite.com")
                .password("admin123")
                .build();

        ResponseEntity<ApiResponse<AuthResponse>> response = authController.login(request);
        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getData().getToken());
    }

    @Test
    void testForgotPasswordEndpoint() {
        ForgotPasswordRequest request = ForgotPasswordRequest.builder()
                .email("admin@urbanbite.com")
                .build();

        ResponseEntity<ApiResponse<String>> response = authController.forgotPassword(request);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
    }
}
