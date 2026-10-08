package com.urbanbite.repository;

import com.urbanbite.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByCityIgnoreCase(String city);
    List<Restaurant> findByCuisineIgnoreCase(String cuisine);
    List<Restaurant> findByIsOpenTrue();
}
