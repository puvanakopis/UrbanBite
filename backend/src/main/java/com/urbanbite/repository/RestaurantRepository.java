package com.urbanbite.repository;

import com.urbanbite.model.RestaurantModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<RestaurantModel, Long> {
    Optional<RestaurantModel> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
