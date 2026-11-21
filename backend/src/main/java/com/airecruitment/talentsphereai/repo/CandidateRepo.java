package com.airecruitment.talentsphereai.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airecruitment.talentsphereai.model.Candidates;



@Repository
public interface CandidateRepo extends JpaRepository<Candidates, Long> {
   
}