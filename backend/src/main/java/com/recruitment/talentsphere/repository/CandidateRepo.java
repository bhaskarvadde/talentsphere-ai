package com.recruitment.talentsphere.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recruitment.talentsphere.entity.Candidate;

public interface CandidateRepo extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByUserEmail(String email);
}
