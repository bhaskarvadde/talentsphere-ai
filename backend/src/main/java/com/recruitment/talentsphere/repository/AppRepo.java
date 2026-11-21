package com.recruitment.talentsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recruitment.talentsphere.entity.Application;

public interface AppRepo extends JpaRepository<Application, Long> {
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
    List<Application> findByCandidateUserEmailOrderByAppliedAtDesc(String email);
    List<Application> findByJobIdOrderByMatchScoreDesc(Long jobId);
    List<Application> findByJobRecruiterEmail(String email);
}
