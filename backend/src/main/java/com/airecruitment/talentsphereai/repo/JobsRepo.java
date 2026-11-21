package com.airecruitment.talentsphereai.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airecruitment.talentsphereai.model.Jobs;

public interface JobsRepo extends JpaRepository<Jobs,Long> {

	List<Jobs> findByRecruiter_UserId(Long recruiterId);

	List<Jobs> findByJobTitleContainingIgnoreCase(String jobTitle);

}
