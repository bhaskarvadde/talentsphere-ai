package com.recruitment.talentsphere.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recruitment.talentsphere.service.AnalyticsService;

import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/analytics") @RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService service;

    @PreAuthorize("hasRole('RECRUITER')") @GetMapping("/recruiter")
    public Map<String, Object> recruiter(Authentication a) { return service.recruiter(a.getName()); }

    @PreAuthorize("hasRole('CANDIDATE')") @GetMapping("/candidate")
    public Map<String, Object> candidate(Authentication a) { return service.candidate(a.getName()); }
}
