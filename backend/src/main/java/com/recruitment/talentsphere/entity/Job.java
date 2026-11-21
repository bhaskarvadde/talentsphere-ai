package com.recruitment.talentsphere.entity;


import java.time.LocalDateTime;

import com.recruitment.talentsphere.entity.Enums.JobStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity @Table(name = "jobs")
@Getter @Setter @NoArgsConstructor
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "recruiter_id") private User recruiter;
    private String title;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(columnDefinition = "TEXT") private String requiredSkills;
    private String location;
    private Integer experienceRequired;
    private String salaryRange;
    @Enumerated(EnumType.STRING) private JobStatus status = JobStatus.OPEN;
    private LocalDateTime createdAt = LocalDateTime.now();
}
