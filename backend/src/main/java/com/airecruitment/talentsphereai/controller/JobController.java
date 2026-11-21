package com.airecruitment.talentsphereai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.airecruitment.talentsphereai.model.Jobs;
import com.airecruitment.talentsphereai.service.JobSeviceInterface;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobSeviceInterface jobService;

    // Save Job
    @PostMapping
    public ResponseEntity<Jobs> saveJob(@RequestBody Jobs job) {

        Jobs savedJob = jobService.saveJob(job);

        return new ResponseEntity<>(savedJob, HttpStatus.CREATED);
    }

    // Get Job By ID
    @GetMapping("/{jobId}")
    public ResponseEntity<Jobs> getJobById(@PathVariable Long jobId) {

        Jobs job = jobService.getJobById(jobId);

        if (job != null) {
            return new ResponseEntity<>(job, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Get All Jobs
    @GetMapping
    public ResponseEntity<List<Jobs>> getAllJobs() {

        List<Jobs> jobs = jobService.getAllJobs();

        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    // Update Job
    @PutMapping("/{jobId}")
    public ResponseEntity<Jobs> updateJob(
            @PathVariable Long jobId,
            @RequestBody Jobs job) {

        Jobs updatedJob = jobService.updateJob(jobId, job);

        if (updatedJob != null) {
            return new ResponseEntity<>(updatedJob, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete Job
    @DeleteMapping("/{jobId}")
    public ResponseEntity<String> deleteJob(@PathVariable Long jobId) {

        Jobs job = jobService.getJobById(jobId);

        if (job != null) {
            jobService.deleteJob(jobId);

            return new ResponseEntity<>(
                    "Job deleted successfully", HttpStatus.OK);
        }

        return new ResponseEntity<>(
                "Job not found", HttpStatus.NOT_FOUND);
    }

    // Get Jobs By Recruiter ID
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<Jobs>> getJobsByRecruiterId(
            @PathVariable Long recruiterId) {

        List<Jobs> jobs = jobService.getJobsByRecruiterId(recruiterId);

        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }

    // Search Jobs By Title
    @GetMapping("/search")
    public ResponseEntity<List<Jobs>> searchJobsByTitle(
            @RequestParam String jobTitle) {

        List<Jobs> jobs = jobService.searchJobsByTitle(jobTitle);

        return new ResponseEntity<>(jobs, HttpStatus.OK);
    }
}