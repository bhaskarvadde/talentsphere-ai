package com.airecruitment.talentsphereai.repo;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.airecruitment.talentsphereai.model.Applications;

@Repository
public interface ApplicationRepo extends JpaRepository<Applications, Long> {

	List<Applications> findByCandidate_CandidateId(Long candidateId);

	List<Applications> findByJob_JobId(Long jobId);

}