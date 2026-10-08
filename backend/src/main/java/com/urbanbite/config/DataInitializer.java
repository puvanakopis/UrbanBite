package com.urbanbite.config;

import com.urbanbite.model.Restaurant;
import com.urbanbite.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    @Bean
    public CommandLineRunner loadInitialData(RestaurantRepository repository) {
        return args -> {
            try {
                if (repository.count() == 0) {
                    List<Restaurant> sampleRestaurants = List.of(
                            Restaurant.builder()
                                    .name("The Gourmet Bistro")
                                    .cuisine("Italian, Continental")
                                    .address("124 Downtown Ave")
                                    .city("New York")
                                    .rating(4.8)
                                    .imageUrl("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600")
                                    .isOpen(true)
                                    .build(),
                            Restaurant.builder()
                                    .name("Urban Spice Grill")
                                    .cuisine("Indian, Barbecue")
                                    .address("58 Food Boulevard")
                                    .city("New York")
                                    .rating(4.6)
                                    .imageUrl("https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600")
                                    .isOpen(true)
                                    .build(),
                            Restaurant.builder()
                                    .name("Tokyo Sizzle Sushi")
                                    .cuisine("Japanese, Asian")
                                    .address("88 Sakura Street")
                                    .city("New York")
                                    .rating(4.9)
                                    .imageUrl("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600")
                                    .isOpen(true)
                                    .build()
                    );
                    repository.saveAll(sampleRestaurants);
                    log.info("Populated initial seed data for {} restaurants.", sampleRestaurants.size());
                }
            } catch (Exception e) {
                log.warn("Database initialization skipped or encountered notice: {}", e.getMessage());
            }
        };
    }
}
