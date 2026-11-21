package com.airecruitment.talentsphereai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airecruitment.talentsphereai.model.Jobs;
import com.airecruitment.talentsphereai.repo.JobsRepo;

@Service
public class JobsImpl implements JobSeviceInterface {

    @Autowired
    private JobsRepo jobRepo;

    @Override
    public Jobs saveJob(Jobs job) {
        return jobRepo.save(job);
    }

    @Override
    public Jobs getJobById(Long jobId) {
        return jobRepo.findById(jobId).orElse(null);
    }

    @Override
    public List<Jobs> getAllJobs() {
        return jobRepo.findAll();
    }

    @Override
    public Jobs updateJob(Long jobId, Jobs job) {

        Jobs existingJob = jobRepo.findById(jobId).orElse(null);

        if (existingJob != null) {

            existingJob.setJobTitle(job.getJobTitle());
            existingJob.setDescription(job.getDescription());
            existingJob.setRequiredSkills(job.getRequiredSkills());
            existingJob.setExperienceRequired(job.getExperienceRequired());

            return jobRepo.save(existingJob);
        }

        return null;
    }

    @Override
    public void deleteJob(Long jobId) {
        jobRepo.deleteById(jobId);
    }

    @Override
    public List<Jobs> getJobsByRecruiterId(Long recruiterId) {
        return jobRepo.findByRecruiter_UserId(recruiterId);
    }

    @Override
    public List<Jobs> searchJobsByTitle(String jobTitle) {
        return jobRepo.findByJobTitleContainingIgnoreCase(jobTitle);
    }
}