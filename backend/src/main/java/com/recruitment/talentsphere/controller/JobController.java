package com.recruitment.talentsphere.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.recruitment.talentsphere.dto.Dtos.JobReq;
import com.recruitment.talentsphere.entity.Application;
import com.recruitment.talentsphere.entity.Enums.JobStatus;
import com.recruitment.talentsphere.entity.Job;
import com.recruitment.talentsphere.service.JobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/jobs") @RequiredArgsConstructor
public class JobController {
    private final JobService service;

    @PreAuthorize("hasRole('RECRUITER')") @PostMapping
    public Job create(@Valid @RequestBody JobReq r, Authentication a) { return service.create(a.getName(), r); }

    @GetMapping public List<Job> list(@RequestParam(required = false) String q) { return service.list(q); }

    @PreAuthorize("hasRole('RECRUITER')") @GetMapping("/mine")
    public List<Job> mine(Authentication a) { return service.mine(a.getName()); }

    @GetMapping("/{id}") public Job get(@PathVariable Long id) { return service.get(id); }

    @PreAuthorize("hasRole('RECRUITER')") @PutMapping("/{id}/status")
    public Job status(@PathVariable Long id, @RequestParam JobStatus status, Authentication a) {
        return service.setStatus(id, a.getName(), status);
    }

    @PreAuthorize("hasRole('CANDIDATE')") @PostMapping("/{id}/apply")
    public Application apply(@PathVariable Long id, Authentication a) { return service.apply(id, a.getName()); }

    @PreAuthorize("hasRole('RECRUITER')") @GetMapping("/{id}/applications")
    public List<Application> applications(@PathVariable Long id, Authentication a) { return service.forJob(id, a.getName()); }
}
