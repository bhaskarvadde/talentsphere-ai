package com.recruitment.talentsphere.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.recruitment.talentsphere.dto.Dtos.ProfileReq;
import com.recruitment.talentsphere.entity.Candidate;
import com.recruitment.talentsphere.entity.ResumeAnalysis;
import com.recruitment.talentsphere.service.CandidateService;

import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/candidate") @RequiredArgsConstructor
@PreAuthorize("hasRole('CANDIDATE')")
public class CandidateController {
    private final CandidateService service;

    @GetMapping("/me") public Candidate me(Authentication a) { return service.me(a.getName()); }
    @PutMapping("/me") public Candidate update(@RequestBody ProfileReq r, Authentication a) { return service.update(a.getName(), r); }

    @PostMapping(value = "/resume", consumes = "multipart/form-data")
    public JsonNode upload(@RequestParam("file") MultipartFile file, Authentication a) throws IOException {
        return service.uploadResume(a.getName(), file);
    }

    @GetMapping("/analyses") public List<ResumeAnalysis> history(Authentication a) { return service.history(a.getName()); }
}
