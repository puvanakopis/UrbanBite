package com.urbanbite.config;

import com.urbanbite.model.AdminModel;
import com.urbanbite.model.CustomerModel;
import com.urbanbite.model.DeliveryHubModel;
import com.urbanbite.model.RestaurantModel;
import com.urbanbite.model.Role;
import com.urbanbite.repository.AdminRepository;
import com.urbanbite.repository.CustomerRepository;
import com.urbanbite.repository.DeliveryHubRepository;
import com.urbanbite.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;
    private final DeliveryHubRepository deliveryHubRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initDefaultAccounts();
    }

    private void initDefaultAccounts() {
        // 1. Admin Account
        if (!adminRepository.existsByEmailIgnoreCase("admin@urbanbite.com")) {
            AdminModel admin = AdminModel.builder()
                    .email("admin@urbanbite.com")
                    .fullName("UrbanBite Administrator")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+1 (555) 019-0001")
                    .role(Role.ROLE_ADMIN)
                    .isActive(true)
                    .build();
            adminRepository.save(admin);
            log.info("Initialized default Admin: admin@urbanbite.com (password: admin123)");
        }

        // 2. Customer Account
        if (!customerRepository.existsByEmailIgnoreCase("customer@urbanbite.com")) {
            CustomerModel customer = CustomerModel.builder()
                    .email("customer@urbanbite.com")
                    .fullName("Alexander Wright")
                    .password(passwordEncoder.encode("customer123"))
                    .phone("+1 (555) 019-2831")
                    .address("742 Evergreen Terrace, New York, NY 10001")
                    .role(Role.ROLE_CUSTOMER)
                    .isVerified(true)
                    .isActive(true)
                    .build();
            customerRepository.save(customer);
            log.info("Initialized default Customer: customer@urbanbite.com (password: customer123)");
        }

        // 3. Restaurant Owner Account
        if (!restaurantRepository.existsByEmailIgnoreCase("owner@urbanbite.com")) {
            RestaurantModel restaurant = RestaurantModel.builder()
                    .email("owner@urbanbite.com")
                    .restaurantName("L'Atelier Bistro")
                    .ownerName("Jean-Luc Moreau")
                    .password(passwordEncoder.encode("restaurant123"))
                    .phone("+1 (555) 019-4455")
                    .address("142 Mercer Street, Soho, New York, NY 10012")
                    .cuisine("Contemporary French Fusion")
                    .role(Role.ROLE_RESTAURANT_OWNER)
                    .isVerified(true)
                    .isActive(true)
                    .build();
            restaurantRepository.save(restaurant);
            log.info("Initialized default Restaurant: owner@urbanbite.com (password: restaurant123)");
        }

        // 4. Delivery Hub / Courier Account
        if (!deliveryHubRepository.existsByEmailIgnoreCase("delivery@urbanbite.com")) {
            DeliveryHubModel deliveryHub = DeliveryHubModel.builder()
                    .email("delivery@urbanbite.com")
                    .hubName("UrbanBite Metro Hub")
                    .contactPerson("Marcus Vance")
                    .password(passwordEncoder.encode("delivery123"))
                    .phone("+1 (555) 019-7722")
                    .vehicleType("Electric Cargo Scooter")
                    .serviceArea("Manhattan Central & Soho")
                    .role(Role.ROLE_DELIVERY_PARTNER)
                    .isVerified(true)
                    .isActive(true)
                    .build();
            deliveryHubRepository.save(deliveryHub);
            log.info("Initialized default Delivery Hub: delivery@urbanbite.com (password: delivery123)");
        }
    }
}
