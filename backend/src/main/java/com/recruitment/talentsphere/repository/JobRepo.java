package com.recruitment.talentsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.recruitment.talentsphere.entity.Enums.JobStatus;
import com.recruitment.talentsphere.entity.Job;

public interface JobRepo extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterEmailOrderByCreatedAtDesc(String email);

    @Query("select j from Job j where j.status = :status and (lower(j.title) like lower(concat('%', :q, '%')) " +
           "or lower(coalesce(j.requiredSkills,'')) like lower(concat('%', :q, '%'))) order by j.createdAt desc")
    List<Job> search(@Param("status") JobStatus status, @Param("q") String q);
}
