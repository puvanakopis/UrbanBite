package com.urbanbite.repository;

import com.urbanbite.model.AdminModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<AdminModel, Long> {
    Optional<AdminModel> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
