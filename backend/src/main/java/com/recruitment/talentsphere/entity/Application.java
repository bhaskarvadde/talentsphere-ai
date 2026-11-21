package com.recruitment.talentsphere.entity;

import java.time.LocalDateTime;

import com.recruitment.talentsphere.entity.Enums.AppStatus;

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
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "applications", uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "candidate_id"}))
@Getter @Setter @NoArgsConstructor
public class Application {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "job_id") private Job job;
    @ManyToOne(optional = false) @JoinColumn(name = "candidate_id") private Candidate candidate;
    @Enumerated(EnumType.STRING) private AppStatus status = AppStatus.APPLIED;
    private Integer matchScore;
    @Column(columnDefinition = "TEXT") private String aiSummary;
    private LocalDateTime appliedAt = LocalDateTime.now();
}