package com.airecruitment.talentsphereai.repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airecruitment.talentsphereai.model.ResumeAnalysis;

@Repository
public interface ResumeAnalysisRepo extends JpaRepository<ResumeAnalysis, Long> {

}