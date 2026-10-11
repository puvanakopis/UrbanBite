package com.urbanbite;

import com.urbanbite.dto.*;
import com.urbanbite.model.*;
import com.urbanbite.repository.*;
import com.urbanbite.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private DeliveryHubRepository deliveryHubRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Test
    void testCustomerRegistrationAndOtpVerification() {
        String testEmail = "test_customer_" + System.currentTimeMillis() + "@urbanbite.com";

        RegisterRequest request = RegisterRequest.builder()
                .fullName("Test Customer")
                .email(testEmail)
                .password("Password@123")
                .phone("+15551234567")
                .role(Role.ROLE_CUSTOMER)
                .build();

        String regResult = authService.register(request);
        assertNotNull(regResult);
        assertTrue(customerRepository.existsByEmailIgnoreCase(testEmail));

        // Get OTP
        OtpModel challenge = otpRepository
                .findTopByEmailIgnoreCaseAndChallengeTypeAndIsUsedFalseOrderByCreatedAtDesc(testEmail, "REGISTRATION")
                .orElseThrow();
        assertNotNull(challenge.getOtpCode());

        // Verify OTP
        VerifyOtpRequest verifyReq = VerifyOtpRequest.builder()
                .email(testEmail)
                .otp(challenge.getOtpCode())
                .challengeType("REGISTRATION")
                .build();

        AuthResponse authResponse = authService.verifyOtp(verifyReq);
        assertNotNull(authResponse.getToken());
        assertEquals(Role.ROLE_CUSTOMER, authResponse.getRole());
        assertTrue(authResponse.isVerified());

        // Login
        LoginRequest loginReq = LoginRequest.builder()
                .email(testEmail)
                .password("Password@123")
                .build();

        AuthResponse loginRes = authService.login(loginReq);
        assertNotNull(loginRes.getToken());
    }

    @Test
    void testRestaurantAndDeliveryHubIndependentEntities() {
        String restEmail = "test_bistro_" + System.currentTimeMillis() + "@urbanbite.com";
        RegisterRequest restReq = RegisterRequest.builder()
                .fullName("Chez Pierre Bistro")
                .email(restEmail)
                .password("Bistro@123")
                .role(Role.ROLE_RESTAURANT_OWNER)
                .cuisine("French")
                .build();

        authService.register(restReq);
        assertTrue(restaurantRepository.existsByEmailIgnoreCase(restEmail));
        assertFalse(customerRepository.existsByEmailIgnoreCase(restEmail));

        String hubEmail = "test_hub_" + System.currentTimeMillis() + "@urbanbite.com";
        RegisterRequest hubReq = RegisterRequest.builder()
                .fullName("Downtown Courier Hub")
                .email(hubEmail)
                .password("Hub@123")
                .role(Role.ROLE_DELIVERY_PARTNER)
                .vehicleType("Cargo E-Bike")
                .build();

        authService.register(hubReq);
        assertTrue(deliveryHubRepository.existsByEmailIgnoreCase(hubEmail));
        assertFalse(customerRepository.existsByEmailIgnoreCase(hubEmail));
    }
}
