package com.urbanbite.controller;

import com.urbanbite.dto.*;
import com.urbanbite.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication Controller", description = "Unified controller for registration, OTP verification, login, password recovery, and profile inspection")
public class AuthController {

    private final AuthService authService;

    // REGISTRATION & OTP VERIFICATION

    @PostMapping("/register")
    @Operation(summary = "Register a new Customer, Restaurant Owner, Delivery Partner, or Admin")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String result = authService.register(request);
        return ResponseEntity.ok(ApiResponse.ok(result, result));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP code to activate account and receive JWT access token")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("Account verified successfully", response));
    }

    @PostMapping("/resend-otp")
    @Operation(summary = "Resend a new 6-digit OTP code to registered email")
    public ResponseEntity<ApiResponse<String>> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        String result = authService.resendOtp(request);
        return ResponseEntity.ok(ApiResponse.ok(result, result));
    }

    // LOGIN & PROFILE

    @PostMapping("/login")
    @Operation(summary = "Authenticate user across Admin, Customer, Restaurant, and DeliveryHub accounts")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Authentication successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Fetch profile summary of currently authenticated user")
    public ResponseEntity<ApiResponse<UserSummaryDto>> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null
                || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized: Session not found"));
        }

        UserSummaryDto userSummary = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved successfully", userSummary));
    }

    // PASSWORD RECOVERY

    @PostMapping("/forgot-password")
    @Operation(summary = "Initiate password recovery by requesting an OTP code to registered email")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String result = authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.ok(result, result));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset account password with verified OTP code")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String result = authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok(result, result));
    }
}
