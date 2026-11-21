package com.recruitment.talentsphere.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.recruitment.talentsphere.entity.Candidate;
import com.recruitment.talentsphere.entity.Enums.AnalysisType;
import com.recruitment.talentsphere.entity.Job;
import com.recruitment.talentsphere.entity.ResumeAnalysis;
import com.recruitment.talentsphere.repository.AnalysisRepo;
import com.recruitment.talentsphere.repository.CandidateRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiFeatureService {
    private final AiService ai;
    private final AnalysisRepo analyses;
    private final CandidateRepo candidates;

    private void need(Candidate c) {
        if (!c.hasResume()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload your resume first");
    }

    private void store(Candidate c, Job j, AnalysisType t, int score, JsonNode r) {
        if (c == null) return;
        ResumeAnalysis a = new ResumeAnalysis();
        a.setCandidate(c); a.setJob(j); a.setType(t); a.setScore(score); a.setContent(r.toString());
        analyses.save(a);
    }

    public JsonNode analyzeResume(Candidate c) {
        need(c);
        JsonNode r = ai.analyzeResume(c.getResumeText());
        List<String> skills = new ArrayList<>();
        r.path("extractedSkills").forEach(n -> skills.add(n.asText()));
        if (!skills.isEmpty()) { c.setSkills(String.join(", ", skills)); candidates.save(c); }
        store(c, null, AnalysisType.RESUME_ANALYSIS, r.path("score").asInt(0), r);
        return r;
    }

    public JsonNode match(Candidate c, Job j) {
        need(c);
        JsonNode r = ai.matchJob(c.getResumeText(), j);
        store(c, j, AnalysisType.JOB_MATCH, r.path("matchScore").asInt(0), r);
        return r;
    }

    public JsonNode interview(Candidate c, Job j) { // c may be null (recruiter, job-only questions)
        JsonNode r = ai.interviewQuestions(c == null ? null : c.getResumeText(), j);
        store(c, j, AnalysisType.INTERVIEW_QUESTIONS, 0, r);
        return r;
    }

    public JsonNode improve(Candidate c, Job j) {
        need(c);
        JsonNode r = ai.improveResume(c.getResumeText(), j);
        store(c, j, AnalysisType.RESUME_IMPROVEMENT, r.path("atsScore").asInt(0), r);
        return r;
    }
}
