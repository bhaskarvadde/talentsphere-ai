package com.airecruitment.talentsphereai.service;

import java.util.List;

import com.airecruitment.talentsphereai.model.Candidates;

public interface CandidateServiceInteface {

    Candidates saveCandidate(Candidates candidate);

    Candidates getCandidateById(Long candidateId);

    List<Candidates> getAllCandidates();

    Candidates updateCandidate(Long candidateId, Candidates candidate);

    void deleteCandidate(Long candidateId);

    Candidates getCandidateByUserId(Long userId);
}

