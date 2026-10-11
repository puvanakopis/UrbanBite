package com.urbanbite.repository;

import com.urbanbite.model.DeliveryHubModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryHubRepository extends JpaRepository<DeliveryHubModel, Long> {
    Optional<DeliveryHubModel> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
