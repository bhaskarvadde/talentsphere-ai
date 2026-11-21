package com.airecruitment.talentsphereai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airecruitment.talentsphereai.model.Applications;
import com.airecruitment.talentsphereai.service.ApplicationServiceInterface;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationServiceInterface applicationService;

    // Save Application
    @PostMapping
    public ResponseEntity<Applications> saveApplication(
            @RequestBody Applications application) {

        Applications savedApplication =
                applicationService.saveApplication(application);

        return new ResponseEntity<>(savedApplication, HttpStatus.CREATED);
    }

    // Get Application By ID
    @GetMapping("/{applicationId}")
    public ResponseEntity<Applications> getApplicationById(
            @PathVariable Long applicationId) {

        Applications application =
                applicationService.getApplicationById(applicationId);

        if (application != null) {
            return new ResponseEntity<>(application, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Get All Applications
    @GetMapping
    public ResponseEntity<List<Applications>> getAllApplications() {

        List<Applications> applications =
                applicationService.getAllApplications();

        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    // Update Application
    @PutMapping("/{applicationId}")
    public ResponseEntity<Applications> updateApplication(
            @PathVariable Long applicationId,
            @RequestBody Applications application) {

        Applications updatedApplication =
                applicationService.updateApplication(applicationId, application);

        if (updatedApplication != null) {
            return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete Application
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<String> deleteApplication(
            @PathVariable Long applicationId) {

        Applications application =
                applicationService.getApplicationById(applicationId);

        if (application != null) {
            applicationService.deleteApplication(applicationId);

            return new ResponseEntity<>(
                    "Application deleted successfully", HttpStatus.OK);
        }

        return new ResponseEntity<>(
                "Application not found", HttpStatus.NOT_FOUND);
    }

    // Get Applications By Candidate ID
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Applications>> getApplicationsByCandidateId(
            @PathVariable Long candidateId) {

        List<Applications> applications =
                applicationService.getApplicationsByCandidateId(candidateId);

        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    // Get Applications By Job ID
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Applications>> getApplicationsByJobId(
            @PathVariable Long jobId) {

        List<Applications> applications =
                applicationService.getApplicationsByJobId(jobId);

        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    // Update Application Status
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<Applications> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status) {

        Applications updatedApplication =
                applicationService.updateApplicationStatus(applicationId, status);

        if (updatedApplication != null) {
            return new ResponseEntity<>(updatedApplication, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}