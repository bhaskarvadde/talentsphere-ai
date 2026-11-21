package com.airecruitment.talentsphereai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airecruitment.talentsphereai.model.Candidates;
import com.airecruitment.talentsphereai.service.CandidateServiceInteface;

@RestController
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "*")
public class CandidateController {

    @Autowired
    private CandidateServiceInteface candidateService;

    // Save Candidate
    @PostMapping
    public ResponseEntity<Candidates> saveCandidate(@RequestBody Candidates candidate) {
        Candidates savedCandidate = candidateService.saveCandidate(candidate);
        return new ResponseEntity<>(savedCandidate, HttpStatus.CREATED);
    }

    // Get Candidate By ID
    @GetMapping("/{candidateId}")
    public ResponseEntity<Candidates> getCandidateById(@PathVariable Long candidateId) {

        Candidates candidate = candidateService.getCandidateById(candidateId);

        if (candidate != null) {
            return new ResponseEntity<>(candidate, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Get All Candidates
    @GetMapping
    public ResponseEntity<List<Candidates>> getAllCandidates() {
        List<Candidates> candidates = candidateService.getAllCandidates();
        return new ResponseEntity<>(candidates, HttpStatus.OK);
    }

    // Update Candidate
    @PutMapping("/{candidateId}")
    public ResponseEntity<Candidates> updateCandidate(
            @PathVariable Long candidateId,
            @RequestBody Candidates candidate) {

        Candidates updatedCandidate = candidateService.updateCandidate(candidateId, candidate);

        if (updatedCandidate != null) {
            return new ResponseEntity<>(updatedCandidate, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete Candidate
    @DeleteMapping("/{candidateId}")
    public ResponseEntity<String> deleteCandidate(@PathVariable Long candidateId) {

        Candidates candidate = candidateService.getCandidateById(candidateId);

        if (candidate != null) {
            candidateService.deleteCandidate(candidateId);
            return new ResponseEntity<>("Candidate deleted successfully", HttpStatus.OK);
        }

        return new ResponseEntity<>("Candidate not found", HttpStatus.NOT_FOUND);
    }

    // Get Candidate By User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<Candidates> getCandidateByUserId(@PathVariable Long userId) {

        Candidates candidate = candidateService.getCandidateByUserId(userId);

        if (candidate != null) {
            return new ResponseEntity<>(candidate, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}