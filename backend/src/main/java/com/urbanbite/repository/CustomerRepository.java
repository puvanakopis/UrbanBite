package com.urbanbite.repository;

import com.urbanbite.model.CustomerModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerModel, Long> {
    Optional<CustomerModel> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
