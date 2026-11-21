package com.airecruitment.talentsphereai.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airecruitment.talentsphereai.model.ResumeAnalysis;
import com.airecruitment.talentsphereai.repo.ResumeAnalysisRepo;

@Service
public class ResumeAnalysisImpl implements ResumeServiceInterface {

    @Autowired
    private ResumeAnalysisRepo resumeAnalysisRepo;

    @Override
    public ResumeAnalysis saveAnalysis(ResumeAnalysis analysis) {
        return resumeAnalysisRepo.save(analysis);
    }

    @Override
    public ResumeAnalysis getAnalysisById(Long analysisId) {
        return resumeAnalysisRepo.findById(analysisId).orElse(null);
    }

    @Override
    public List<ResumeAnalysis> getAllAnalyses() {
        return resumeAnalysisRepo.findAll();
    }

    @Override
    public ResumeAnalysis updateAnalysis(Long analysisId, ResumeAnalysis analysis) {

        ResumeAnalysis existingAnalysis =
                resumeAnalysisRepo.findById(analysisId).orElse(null);

        if (existingAnalysis != null) {

            existingAnalysis.setResumeFileName(analysis.getResumeFileName());
            existingAnalysis.setExtractedSkills(analysis.getExtractedSkills());
            existingAnalysis.setExperienceSummary(analysis.getExperienceSummary());
            existingAnalysis.setOverallScore(analysis.getOverallScore());

            return resumeAnalysisRepo.save(existingAnalysis);
        }

        return null;
    }

    @Override
    public void deleteAnalysis(Long analysisId) {
        resumeAnalysisRepo.deleteById(analysisId);
    }

    @Override
    public List<ResumeAnalysis> getAnalysesByCandidateId(Long candidateId) {
        return resumeAnalysisRepo.findByCandidate_CandidateId(candidateId);
    }

    @Override
    public ResumeAnalysis analyzeResume(Long candidateId) {

        // Retrieve resume analysis using candidate ID
        List<ResumeAnalysis> analyses =
                resumeAnalysisRepo.findByCandidate_CandidateId(candidateId);

        if (!analyses.isEmpty()) {
            return analyses.get(0);
        }

        return null;
    }
}