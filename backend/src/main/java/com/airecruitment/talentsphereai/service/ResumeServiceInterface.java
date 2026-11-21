
package com.airecruitment.talentsphereai.service;

import java.util.List;

import com.airecruitment.talentsphereai.model.ResumeAnalysis;

public interface ResumeServiceInterface {

    ResumeAnalysis saveAnalysis(ResumeAnalysis analysis);

    ResumeAnalysis getAnalysisById(Long analysisId);

    List<ResumeAnalysis> getAllAnalyses();

    ResumeAnalysis updateAnalysis(Long analysisId, ResumeAnalysis analysis);

    void deleteAnalysis(Long analysisId);

    List<ResumeAnalysis> getAnalysesByCandidateId(Long candidateId);

    ResumeAnalysis analyzeResume(Long candidateId);
}
