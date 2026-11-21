package com.recruitment.talentsphere.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.recruitment.talentsphere.dto.Dtos.ProfileReq;
import com.recruitment.talentsphere.entity.Candidate;
import com.recruitment.talentsphere.entity.ResumeAnalysis;
import com.recruitment.talentsphere.repository.AnalysisRepo;
import com.recruitment.talentsphere.repository.CandidateRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {
    private final CandidateRepo candidates;
    private final AnalysisRepo analyses;
    private final AiFeatureService features;

    public Candidate me(String email) {
        return candidates.findByUserEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate profile not found"));
    }

    public Candidate byId(Long id) {
        return candidates.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidate not found"));
    }

    public Candidate update(String email, ProfileReq r) {
        Candidate c = me(email);
        c.setPhone(r.phone()); c.setSkills(r.skills()); c.setExperienceYears(r.experienceYears());
        c.setEducation(r.education()); c.setLocation(r.location());
        return candidates.save(c);
    }

    public JsonNode uploadResume(String email, MultipartFile f) throws IOException {
        Candidate c = me(email);
        String name = f.getOriginalFilename() == null ? "resume" : f.getOriginalFilename();
        String text;
        if (name.toLowerCase().endsWith(".pdf")) {
            try (PDDocument d = Loader.loadPDF(f.getBytes())) { text = new PDFTextStripper().getText(d); }
        } else {
            text = new String(f.getBytes(), StandardCharsets.UTF_8);
        }
        if (text == null || text.isBlank())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read text from the file");
        c.setResumeText(text); c.setResumeFileName(name);
        candidates.save(c);
        return features.analyzeResume(c); // AI analysis runs automatically on upload
    }

    public List<ResumeAnalysis> history(String email) {
        return analyses.findByCandidateIdOrderByCreatedAtDesc(me(email).getId());
    }
}
