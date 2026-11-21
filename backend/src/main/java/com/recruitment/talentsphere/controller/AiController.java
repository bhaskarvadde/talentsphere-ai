package com.recruitment.talentsphere.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.recruitment.talentsphere.entity.Candidate;
import com.recruitment.talentsphere.service.AiFeatureService;
import com.recruitment.talentsphere.service.CandidateService;
import com.recruitment.talentsphere.service.JobService;

import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/ai") @RequiredArgsConstructor
public class AiController {
    private final AiFeatureService features;
    private final CandidateService candidates;
    private final JobService jobs;

    @PreAuthorize("hasRole('CANDIDATE')") @PostMapping("/analyze-resume")
    public JsonNode analyze(Authentication a) { return features.analyzeResume(candidates.me(a.getName())); }

    @PreAuthorize("hasRole('CANDIDATE')") @GetMapping("/match/{jobId}")
    public JsonNode match(@PathVariable Long jobId, Authentication a) {
        return features.match(candidates.me(a.getName()), jobs.get(jobId));
    }

    // Candidate: uses own resume. Recruiter: pass ?candidateId= to tailor to an applicant, or omit for job-only questions.
    @GetMapping("/interview-questions/{jobId}")
    public JsonNode interview(@PathVariable Long jobId, @RequestParam(required = false) Long candidateId, Authentication a) {
        boolean isCandidate = a.getAuthorities().stream().anyMatch(x -> x.getAuthority().equals("ROLE_CANDIDATE"));
        Candidate c = null;
        if (isCandidate) c = candidates.me(a.getName());
        else if (candidateId != null) c = candidates.byId(candidateId);
        return features.interview(c, jobs.get(jobId));
    }

    @PreAuthorize("hasRole('CANDIDATE')") @PostMapping("/improve-resume")
    public JsonNode improve(@RequestParam(required = false) Long jobId, Authentication a) {
        return features.improve(candidates.me(a.getName()), jobId == null ? null : jobs.get(jobId));
    }
}