package com.recruitment.talentsphere.service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.recruitment.talentsphere.entity.Application;
import com.recruitment.talentsphere.entity.Enums.AppStatus;
import com.recruitment.talentsphere.entity.Enums.JobStatus;
import com.recruitment.talentsphere.entity.Job;
import com.recruitment.talentsphere.repository.AppRepo;
import com.recruitment.talentsphere.repository.JobRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final JobRepo jobs;
    private final AppRepo apps;

    private double avg(List<Application> as) {
        return Math.round(as.stream().filter(a -> a.getMatchScore() != null)
                .mapToInt(Application::getMatchScore).average().orElse(0) * 10) / 10.0;
    }

    private Map<String, Long> breakdown(List<Application> as) {
        Map<String, Long> m = new LinkedHashMap<>();
        for (AppStatus s : AppStatus.values()) m.put(s.name(), as.stream().filter(a -> a.getStatus() == s).count());
        return m;
    }

    public Map<String, Object> recruiter(String email) {
        List<Job> js = jobs.findByRecruiterEmailOrderByCreatedAtDesc(email);
        List<Application> as = apps.findByJobRecruiterEmail(email);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalJobs", js.size());
        m.put("openJobs", js.stream().filter(j -> j.getStatus() == JobStatus.OPEN).count());
        m.put("totalApplications", as.size());
        m.put("averageMatchScore", avg(as));
        m.put("statusBreakdown", breakdown(as));
        m.put("applicationsPerJob", js.stream().map(j -> {
            List<Application> ja = as.stream().filter(a -> a.getJob().getId().equals(j.getId())).toList();
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("jobId", j.getId()); r.put("title", j.getTitle());
            r.put("applications", ja.size()); r.put("avgScore", avg(ja));
            return r;
        }).toList());
        m.put("topCandidates", as.stream().filter(a -> a.getMatchScore() != null)
                .sorted(Comparator.comparing(Application::getMatchScore, Comparator.reverseOrder()))
                .limit(5)
                .map(a -> Map.of("candidate", a.getCandidate().getUser().getName(),
                                 "job", a.getJob().getTitle(), "score", a.getMatchScore()))
                .toList());
        return m;
    }

    public Map<String, Object> candidate(String email) {
        List<Application> as = apps.findByCandidateUserEmailOrderByAppliedAtDesc(email);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("totalApplications", as.size());
        m.put("averageMatchScore", avg(as));
        m.put("statusBreakdown", breakdown(as));
        return m;
    }
}
