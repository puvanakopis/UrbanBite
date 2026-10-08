package com.urbanbite.service;

import com.urbanbite.model.Restaurant;
import com.urbanbite.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    public Restaurant createRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public Restaurant updateRestaurant(Long id, Restaurant updatedRestaurant) {
        return restaurantRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedRestaurant.getName());
                    existing.setCuisine(updatedRestaurant.getCuisine());
                    existing.setAddress(updatedRestaurant.getAddress());
                    existing.setCity(updatedRestaurant.getCity());
                    existing.setRating(updatedRestaurant.getRating());
                    existing.setImageUrl(updatedRestaurant.getImageUrl());
                    existing.setIsOpen(updatedRestaurant.getIsOpen());
                    return restaurantRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }
}
