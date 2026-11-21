package com.recruitment.talentsphere.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recruitment.talentsphere.dto.Dtos.StatusReq;
import com.recruitment.talentsphere.entity.Application;
import com.recruitment.talentsphere.service.JobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/applications") @RequiredArgsConstructor
public class ApplicationController {
    private final JobService service;

    @PreAuthorize("hasRole('CANDIDATE')") @GetMapping("/mine")
    public List<Application> mine(Authentication a) { return service.myApplications(a.getName()); }

    @PreAuthorize("hasRole('RECRUITER')") @PutMapping("/{id}/status")
    public Application status(@PathVariable Long id, @Valid @RequestBody StatusReq r, Authentication a) {
        return service.updateStatus(id, a.getName(), r.status());
    }
}
