package com.airecruitment.talentsphereai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airecruitment.talentsphereai.model.Candidates;
import com.airecruitment.talentsphereai.repo.CandidateRepo;

@Service
public class CandidateImpl implements CandidateServiceInteface {

    @Autowired
    private CandidateRepo candidateRepo;

    @Override
    public Candidates saveCandidate(Candidates candidate) {
        return candidateRepo.save(candidate);
    }

    @Override
    public Candidates getCandidateById(Long candidateId) {
        return candidateRepo.findById(candidateId).orElse(null);
    }

    @Override
    public List<Candidates> getAllCandidates() {
        return candidateRepo.findAll();
    }

    @Override
    public Candidates updateCandidate(Long candidateId, Candidates candidate) {

        Candidates existingCandidate = candidateRepo.findById(candidateId).orElse(null);

        if (existingCandidate != null) {

        	  existingCandidate.setPhone(candidate.getPhone());
              existingCandidate.setEducation(candidate.getEducation());
              existingCandidate.setExperienceYears(candidate.getExperienceYears());
              existingCandidate.setResumeUrl(candidate.getResumeUrl());

            return candidateRepo.save(existingCandidate);
        }

        return null;
    }

    @Override
    public void deleteCandidate(Long candidateId) {
        candidateRepo.deleteById(candidateId);
    }

    @Override
    public Candidates getCandidateByUserId(Long userId) {
        return candidateRepo.findByUser_UserId(userId);
    }
}