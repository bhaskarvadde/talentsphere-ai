package com.recruitment.talentsphere.service;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.recruitment.talentsphere.dto.Dtos.JobReq;
import com.recruitment.talentsphere.entity.Application;
import com.recruitment.talentsphere.entity.Candidate;
import com.recruitment.talentsphere.entity.Enums.AppStatus;
import com.recruitment.talentsphere.entity.Enums.JobStatus;
import com.recruitment.talentsphere.entity.Job;
import com.recruitment.talentsphere.entity.User;
import com.recruitment.talentsphere.repository.AppRepo;
import com.recruitment.talentsphere.repository.JobRepo;
import com.recruitment.talentsphere.repository.UserRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepo jobs;
    private final UserRepo users;
    private final AppRepo apps;
    private final CandidateService candidates;
    private final AiFeatureService features;

    public Job create(String email, JobReq r) {
        User u = users.findByEmail(email).orElseThrow();
        Job j = new Job();
        j.setRecruiter(u); j.setTitle(r.title()); j.setDescription(r.description());
        j.setRequiredSkills(r.requiredSkills()); j.setLocation(r.location());
        j.setExperienceRequired(r.experienceRequired()); j.setSalaryRange(r.salaryRange());
        return jobs.save(j);
    }

    public List<Job> list(String q) { return jobs.search(JobStatus.OPEN, q == null ? "" : q); }

    public Job get(Long id) {
        return jobs.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }

    public List<Job> mine(String email) { return jobs.findByRecruiterEmailOrderByCreatedAtDesc(email); }

    private Job owned(Long id, String email) {
        Job j = get(id);
        if (!j.getRecruiter().getEmail().equals(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your job");
        return j;
    }

    public Job setStatus(Long id, String email, JobStatus s) {
        Job j = owned(id, email); j.setStatus(s); return jobs.save(j);
    }

    public Application apply(Long jobId, String email) {
        Job j = get(jobId);
        if (j.getStatus() != JobStatus.OPEN) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Job is closed");
        Candidate c = candidates.me(email);
        if (!c.hasResume()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload your resume before applying");
        if (apps.existsByJobIdAndCandidateId(jobId, c.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already applied");
        Application a = new Application();
        a.setJob(j); a.setCandidate(c);
        try { // AI screening on real data; apply still succeeds if AI is down
            JsonNode m = features.match(c, j);
            a.setMatchScore(m.path("matchScore").asInt(0));
            a.setAiSummary(m.path("summary").asText(""));
        } catch (Exception e) {
            a.setAiSummary("AI screening unavailable");
        }
        return apps.save(a);
    }

    public List<Application> myApplications(String email) {
        return apps.findByCandidateUserEmailOrderByAppliedAtDesc(email);
    }

    public List<Application> forJob(Long jobId, String email) {
        owned(jobId, email);
        return apps.findByJobIdOrderByMatchScoreDesc(jobId);
    }

    public Application updateStatus(Long appId, String email, AppStatus s) {
        Application a = apps.findById(appId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        if (!a.getJob().getRecruiter().getEmail().equals(email)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your job");
        a.setStatus(s);
        return apps.save(a);
    }
}
