package com.recruitment.talentsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recruitment.talentsphere.entity.ResumeAnalysis;

public interface AnalysisRepo extends JpaRepository<ResumeAnalysis, Long> {
    List<ResumeAnalysis> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);
}
