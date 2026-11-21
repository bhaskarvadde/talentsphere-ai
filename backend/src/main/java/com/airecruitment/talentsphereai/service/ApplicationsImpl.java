package com.airecruitment.talentsphereai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airecruitment.talentsphereai.model.Applications;
import com.airecruitment.talentsphereai.repo.ApplicationRepo;

@Service
public class ApplicationsImpl implements ApplicationServiceInterface {

    @Autowired
    private ApplicationRepo applicationRepo;

    @Override
    public Applications saveApplication(Applications application) {
        return applicationRepo.save(application);
    }

    @Override
    public Applications getApplicationById(Long applicationId) {
        return applicationRepo.findById(applicationId).orElse(null);
    }

    @Override
    public List<Applications> getAllApplications() {
        return applicationRepo.findAll();
    }

    @Override
    public Applications updateApplication(Long applicationId, Applications application) {

        Applications existingApplication =
                applicationRepo.findById(applicationId).orElse(null);

        if (existingApplication != null) {

            existingApplication.setAppliedDate(application.getAppliedDate());
            existingApplication.setApplicationStatus(application.getApplicationStatus());
            existingApplication.setCoverLetter(application.getCoverLetter());

            return applicationRepo.save(existingApplication);
        }

        return null;
    }

    @Override
    public void deleteApplication(Long applicationId) {
        applicationRepo.deleteById(applicationId);
    }

    @Override
    public List<Applications> getApplicationsByCandidateId(Long candidateId) {
        return applicationRepo.findByCandidate_CandidateId(candidateId);
    }

    @Override
    public List<Applications> getApplicationsByJobId(Long jobId) {
        return applicationRepo.findByJob_JobId(jobId);
    }

    @Override
    public Applications updateApplicationStatus(Long applicationId, String status) {

        Applications existingApplication =
                applicationRepo.findById(applicationId).orElse(null);

        if (existingApplication != null) {

            existingApplication.setApplicationStatus(status);

            return applicationRepo.save(existingApplication);
        }

        return null;
    }
}