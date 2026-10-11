package com.urbanbite.repository;

import com.urbanbite.model.OtpModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpModel, Long> {
    Optional<OtpModel> findTopByEmailIgnoreCaseAndChallengeTypeAndIsUsedFalseOrderByCreatedAtDesc(String email, String challengeType);
    Optional<OtpModel> findTopByEmailIgnoreCaseAndIsUsedFalseOrderByCreatedAtDesc(String email);
    void deleteByEmailIgnoreCase(String email);
}
