package com.airecruitment.talentsphereai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airecruitment.talentsphereai.model.ResumeAnalysis;
import com.airecruitment.talentsphereai.service.ResumeServiceInterface;

@RestController
@RequestMapping("/api/resume-analysis")
@CrossOrigin(origins = "*")
public class ResumeAnalysisController {

    @Autowired
    private ResumeServiceInterface resumeService;

    // Save Resume Analysis
    @PostMapping
    public ResponseEntity<ResumeAnalysis> saveAnalysis(
            @RequestBody ResumeAnalysis analysis) {

        ResumeAnalysis savedAnalysis = resumeService.saveAnalysis(analysis);

        return new ResponseEntity<>(savedAnalysis, HttpStatus.CREATED);
    }

    // Get Analysis By ID
    @GetMapping("/{analysisId}")
    public ResponseEntity<ResumeAnalysis> getAnalysisById(
            @PathVariable Long analysisId) {

        ResumeAnalysis analysis = resumeService.getAnalysisById(analysisId);

        if (analysis != null) {
            return new ResponseEntity<>(analysis, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Get All Resume Analyses
    @GetMapping
    public ResponseEntity<List<ResumeAnalysis>> getAllAnalyses() {

        List<ResumeAnalysis> analyses = resumeService.getAllAnalyses();

        return new ResponseEntity<>(analyses, HttpStatus.OK);
    }

    // Update Resume Analysis
    @PutMapping("/{analysisId}")
    public ResponseEntity<ResumeAnalysis> updateAnalysis(
            @PathVariable Long analysisId,
            @RequestBody ResumeAnalysis analysis) {

        ResumeAnalysis updatedAnalysis =
                resumeService.updateAnalysis(analysisId, analysis);

        if (updatedAnalysis != null) {
            return new ResponseEntity<>(updatedAnalysis, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete Resume Analysis
    @DeleteMapping("/{analysisId}")
    public ResponseEntity<String> deleteAnalysis(
            @PathVariable Long analysisId) {

        ResumeAnalysis analysis = resumeService.getAnalysisById(analysisId);

        if (analysis != null) {
            resumeService.deleteAnalysis(analysisId);

            return new ResponseEntity<>(
                    "Resume analysis deleted successfully", HttpStatus.OK);
        }

        return new ResponseEntity<>(
                "Resume analysis not found", HttpStatus.NOT_FOUND);
    }

    // Get Analyses By Candidate ID
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<ResumeAnalysis>> getAnalysesByCandidateId(
            @PathVariable Long candidateId) {

        List<ResumeAnalysis> analyses =
                resumeService.getAnalysesByCandidateId(candidateId);

        return new ResponseEntity<>(analyses, HttpStatus.OK);
    }

    // Analyze Resume By Candidate ID
    @PostMapping("/analyze/{candidateId}")
    public ResponseEntity<ResumeAnalysis> analyzeResume(
            @PathVariable Long candidateId) {

        ResumeAnalysis analysis = resumeService.analyzeResume(candidateId);

        if (analysis != null) {
            return new ResponseEntity<>(analysis, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}