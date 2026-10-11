package com.urbanbite.service;

import com.urbanbite.dto.*;
import com.urbanbite.model.*;
import com.urbanbite.repository.*;
import com.urbanbite.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;
    private final DeliveryHubRepository deliveryHubRepository;
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (isEmailAlreadyRegistered(email)) {
            throw new IllegalArgumentException("An account with email " + email + " already exists.");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());
        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_CUSTOMER;

        switch (role) {
            case ROLE_ADMIN -> {
                AdminModel admin = AdminModel.builder()
                        .email(email)
                        .fullName(request.getFullName().trim())
                        .password(encodedPassword)
                        .phone(request.getPhone())
                        .role(Role.ROLE_ADMIN)
                        .isActive(true)
                        .build();
                adminRepository.save(admin);
            }
            case ROLE_RESTAURANT_OWNER -> {
                RestaurantModel restaurant = RestaurantModel.builder()
                        .email(email)
                        .restaurantName(request.getFullName().trim())
                        .ownerName(request.getFullName().trim())
                        .password(encodedPassword)
                        .phone(request.getPhone())
                        .address(request.getAddress())
                        .cuisine(request.getCuisine())
                        .role(Role.ROLE_RESTAURANT_OWNER)
                        .isVerified(false)
                        .isActive(true)
                        .build();
                restaurantRepository.save(restaurant);
            }
            case ROLE_DELIVERY_PARTNER -> {
                DeliveryHubModel deliveryHub = DeliveryHubModel.builder()
                        .email(email)
                        .hubName(request.getFullName().trim())
                        .contactPerson(request.getFullName().trim())
                        .password(encodedPassword)
                        .phone(request.getPhone())
                        .vehicleType(request.getVehicleType())
                        .serviceArea(request.getServiceArea())
                        .role(Role.ROLE_DELIVERY_PARTNER)
                        .isVerified(false)
                        .isActive(true)
                        .build();
                deliveryHubRepository.save(deliveryHub);
            }
            default -> {
                CustomerModel customer = CustomerModel.builder()
                        .email(email)
                        .fullName(request.getFullName().trim())
                        .password(encodedPassword)
                        .phone(request.getPhone())
                        .address(request.getAddress())
                        .role(Role.ROLE_CUSTOMER)
                        .isVerified(false)
                        .isActive(true)
                        .build();
                customerRepository.save(customer);
            }
        }

        generateAndSendOtp(email, "REGISTRATION");
        return "Registration successful. Please enter the verification code sent to " + email;
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        // 1. Check Admin
        Optional<AdminModel> adminOpt = adminRepository.findByEmailIgnoreCase(email);
        if (adminOpt.isPresent()) {
            AdminModel a = adminOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), a.getPassword())) {
                throw new IllegalArgumentException("Invalid email or password.");
            }
            if (!a.isActive()) {
                throw new IllegalStateException("Your account has been deactivated. Please contact support.");
            }
            String token = jwtService.generateToken(a.getId(), a.getEmail(), a.getRole().name(), a.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(a.getId())
                    .email(a.getEmail())
                    .fullName(a.getFullName())
                    .role(a.getRole())
                    .isVerified(true)
                    .message("Login successful")
                    .build();
        }

        // 2. Check Customer
        Optional<CustomerModel> customerOpt = customerRepository.findByEmailIgnoreCase(email);
        if (customerOpt.isPresent()) {
            CustomerModel c = customerOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), c.getPassword())) {
                throw new IllegalArgumentException("Invalid email or password.");
            }
            if (!c.isActive()) {
                throw new IllegalStateException("Your account has been deactivated. Please contact support.");
            }
            if (!c.isVerified()) {
                generateAndSendOtp(email, "REGISTRATION");
                throw new IllegalStateException("Email address is not verified yet. A fresh verification OTP has been dispatched to your email.");
            }
            String token = jwtService.generateToken(c.getId(), c.getEmail(), c.getRole().name(), c.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(c.getId())
                    .email(c.getEmail())
                    .fullName(c.getFullName())
                    .role(c.getRole())
                    .isVerified(c.isVerified())
                    .message("Login successful")
                    .build();
        }

        // 3. Check Restaurant
        Optional<RestaurantModel> restOpt = restaurantRepository.findByEmailIgnoreCase(email);
        if (restOpt.isPresent()) {
            RestaurantModel r = restOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), r.getPassword())) {
                throw new IllegalArgumentException("Invalid email or password.");
            }
            if (!r.isActive()) {
                throw new IllegalStateException("Your account has been deactivated. Please contact support.");
            }
            if (!r.isVerified()) {
                generateAndSendOtp(email, "REGISTRATION");
                throw new IllegalStateException("Email address is not verified yet. A fresh verification OTP has been dispatched to your email.");
            }
            String token = jwtService.generateToken(r.getId(), r.getEmail(), r.getRole().name(), r.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(r.getId())
                    .email(r.getEmail())
                    .fullName(r.getFullName())
                    .role(r.getRole())
                    .isVerified(r.isVerified())
                    .restaurantId(r.getId())
                    .message("Login successful")
                    .build();
        }

        // 4. Check Delivery Hub
        Optional<DeliveryHubModel> hubOpt = deliveryHubRepository.findByEmailIgnoreCase(email);
        if (hubOpt.isPresent()) {
            DeliveryHubModel h = hubOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), h.getPassword())) {
                throw new IllegalArgumentException("Invalid email or password.");
            }
            if (!h.isActive()) {
                throw new IllegalStateException("Your account has been deactivated. Please contact support.");
            }
            if (!h.isVerified()) {
                generateAndSendOtp(email, "REGISTRATION");
                throw new IllegalStateException("Email address is not verified yet. A fresh verification OTP has been dispatched to your email.");
            }
            String token = jwtService.generateToken(h.getId(), h.getEmail(), h.getRole().name(), h.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(h.getId())
                    .email(h.getEmail())
                    .fullName(h.getFullName())
                    .role(h.getRole())
                    .isVerified(h.isVerified())
                    .message("Login successful")
                    .build();
        }

        throw new IllegalArgumentException("Invalid email or password.");
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String enteredOtp = request.getOtp().trim();
        String type = request.getChallengeType() != null ? request.getChallengeType().trim().toUpperCase() : "REGISTRATION";

        OtpModel challenge = otpRepository
                .findTopByEmailIgnoreCaseAndChallengeTypeAndIsUsedFalseOrderByCreatedAtDesc(email, type)
                .or(() -> otpRepository.findTopByEmailIgnoreCaseAndIsUsedFalseOrderByCreatedAtDesc(email))
                .orElseThrow(() -> new IllegalArgumentException("No pending verification code found for " + email));

        if (challenge.isExpired()) {
            throw new IllegalArgumentException("Verification code has expired. Please request a new one.");
        }

        if (!challenge.getOtpCode().equals(enteredOtp)) {
            throw new IllegalArgumentException("Invalid verification code. Please check and try again.");
        }

        challenge.setUsed(true);
        otpRepository.save(challenge);

        // Check Customer
        Optional<CustomerModel> customer = customerRepository.findByEmailIgnoreCase(email);
        if (customer.isPresent()) {
            CustomerModel c = customer.get();
            c.setVerified(true);
            customerRepository.save(c);
            String token = jwtService.generateToken(c.getId(), c.getEmail(), c.getRole().name(), c.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(c.getId())
                    .email(c.getEmail())
                    .fullName(c.getFullName())
                    .role(c.getRole())
                    .isVerified(true)
                    .message("Email verified successfully")
                    .build();
        }

        // Check Restaurant
        Optional<RestaurantModel> rest = restaurantRepository.findByEmailIgnoreCase(email);
        if (rest.isPresent()) {
            RestaurantModel r = rest.get();
            r.setVerified(true);
            restaurantRepository.save(r);
            String token = jwtService.generateToken(r.getId(), r.getEmail(), r.getRole().name(), r.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(r.getId())
                    .email(r.getEmail())
                    .fullName(r.getFullName())
                    .role(r.getRole())
                    .isVerified(true)
                    .restaurantId(r.getId())
                    .message("Email verified successfully")
                    .build();
        }

        // Check Delivery Hub
        Optional<DeliveryHubModel> hub = deliveryHubRepository.findByEmailIgnoreCase(email);
        if (hub.isPresent()) {
            DeliveryHubModel h = hub.get();
            h.setVerified(true);
            deliveryHubRepository.save(h);
            String token = jwtService.generateToken(h.getId(), h.getEmail(), h.getRole().name(), h.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(h.getId())
                    .email(h.getEmail())
                    .fullName(h.getFullName())
                    .role(h.getRole())
                    .isVerified(true)
                    .message("Email verified successfully")
                    .build();
        }

        // Check Admin
        Optional<AdminModel> admin = adminRepository.findByEmailIgnoreCase(email);
        if (admin.isPresent()) {
            AdminModel a = admin.get();
            String token = jwtService.generateToken(a.getId(), a.getEmail(), a.getRole().name(), a.getFullName());
            return AuthResponse.builder()
                    .token(token)
                    .userId(a.getId())
                    .email(a.getEmail())
                    .fullName(a.getFullName())
                    .role(a.getRole())
                    .isVerified(true)
                    .message("Email verified successfully")
                    .build();
        }

        throw new IllegalArgumentException("Account not found for email: " + email);
    }

    public String resendOtp(ResendOtpRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String type = request.getChallengeType() != null ? request.getChallengeType().trim().toUpperCase() : "REGISTRATION";

        if (!isEmailAlreadyRegistered(email)) {
            throw new IllegalArgumentException("No account registered with " + email);
        }

        generateAndSendOtp(email, type);
        return "A new verification code has been dispatched to " + email;
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (isEmailAlreadyRegistered(email)) {
            generateAndSendOtp(email, "PASSWORD_RESET");
        } else {
            log.info("Password reset requested for non-existent email: {}", email);
        }

        return "If an account exists with " + email + ", a recovery code has been sent.";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String enteredOtp = request.getOtp().trim();

        OtpModel challenge = otpRepository
                .findTopByEmailIgnoreCaseAndChallengeTypeAndIsUsedFalseOrderByCreatedAtDesc(email, "PASSWORD_RESET")
                .or(() -> otpRepository.findTopByEmailIgnoreCaseAndIsUsedFalseOrderByCreatedAtDesc(email))
                .orElseThrow(() -> new IllegalArgumentException("No valid password reset code found for " + email));

        if (challenge.isExpired()) {
            throw new IllegalArgumentException("Password reset code has expired. Please request a new one.");
        }

        if (!challenge.getOtpCode().equals(enteredOtp)) {
            throw new IllegalArgumentException("Invalid password reset code.");
        }

        challenge.setUsed(true);
        otpRepository.save(challenge);

        String newPasswordHash = passwordEncoder.encode(request.getNewPassword());
        updateAccountPassword(email, newPasswordHash);

        return "Password successfully reset. You may now sign in with your new password.";
    }

    public UserSummaryDto getCurrentUser(String email) {
        String normalizedEmail = email.toLowerCase();

        Optional<AdminModel> admin = adminRepository.findByEmailIgnoreCase(normalizedEmail);
        if (admin.isPresent()) {
            AdminModel a = admin.get();
            return UserSummaryDto.builder()
                    .id(a.getId())
                    .email(a.getEmail())
                    .fullName(a.getFullName())
                    .phone(a.getPhone())
                    .role(a.getRole())
                    .isVerified(true)
                    .isActive(a.isActive())
                    .build();
        }

        Optional<CustomerModel> customer = customerRepository.findByEmailIgnoreCase(normalizedEmail);
        if (customer.isPresent()) {
            CustomerModel c = customer.get();
            return UserSummaryDto.builder()
                    .id(c.getId())
                    .email(c.getEmail())
                    .fullName(c.getFullName())
                    .phone(c.getPhone())
                    .role(c.getRole())
                    .isVerified(c.isVerified())
                    .isActive(c.isActive())
                    .build();
        }

        Optional<RestaurantModel> rest = restaurantRepository.findByEmailIgnoreCase(normalizedEmail);
        if (rest.isPresent()) {
            RestaurantModel r = rest.get();
            return UserSummaryDto.builder()
                    .id(r.getId())
                    .email(r.getEmail())
                    .fullName(r.getFullName())
                    .phone(r.getPhone())
                    .role(r.getRole())
                    .isVerified(r.isVerified())
                    .isActive(r.isActive())
                    .restaurantId(r.getId())
                    .build();
        }

        Optional<DeliveryHubModel> hub = deliveryHubRepository.findByEmailIgnoreCase(normalizedEmail);
        if (hub.isPresent()) {
            DeliveryHubModel h = hub.get();
            return UserSummaryDto.builder()
                    .id(h.getId())
                    .email(h.getEmail())
                    .fullName(h.getFullName())
                    .phone(h.getPhone())
                    .role(h.getRole())
                    .isVerified(h.isVerified())
                    .isActive(h.isActive())
                    .build();
        }

        throw new IllegalArgumentException("User not found");
    }

    public boolean isEmailAlreadyRegistered(String email) {
        return adminRepository.existsByEmailIgnoreCase(email)
                || customerRepository.existsByEmailIgnoreCase(email)
                || restaurantRepository.existsByEmailIgnoreCase(email)
                || deliveryHubRepository.existsByEmailIgnoreCase(email);
    }

    private void generateAndSendOtp(String email, String challengeType) {
        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));

        OtpModel challenge = OtpModel.builder()
                .email(email.toLowerCase())
                .otpCode(otp)
                .challengeType(challengeType)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isUsed(false)
                .build();

        otpRepository.save(challenge);
        emailService.sendOtpEmail(email, otp, challengeType);
    }

    private void updateAccountPassword(String email, String encodedPassword) {
        Optional<AdminModel> admin = adminRepository.findByEmailIgnoreCase(email);
        if (admin.isPresent()) {
            admin.get().setPassword(encodedPassword);
            adminRepository.save(admin.get());
            return;
        }

        Optional<CustomerModel> customer = customerRepository.findByEmailIgnoreCase(email);
        if (customer.isPresent()) {
            customer.get().setPassword(encodedPassword);
            customerRepository.save(customer.get());
            return;
        }

        Optional<RestaurantModel> restaurant = restaurantRepository.findByEmailIgnoreCase(email);
        if (restaurant.isPresent()) {
            restaurant.get().setPassword(encodedPassword);
            restaurantRepository.save(restaurant.get());
            return;
        }

        Optional<DeliveryHubModel> hub = deliveryHubRepository.findByEmailIgnoreCase(email);
        if (hub.isPresent()) {
            hub.get().setPassword(encodedPassword);
            deliveryHubRepository.save(hub.get());
            return;
        }

        throw new IllegalArgumentException("Account not found for email: " + email);
    }
}
