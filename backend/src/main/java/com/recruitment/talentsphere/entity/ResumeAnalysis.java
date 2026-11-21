package com.recruitment.talentsphere.entity;

import java.time.LocalDateTime;

import com.recruitment.talentsphere.entity.Enums.AnalysisType;

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

@Entity @Table(name = "resume_analysis")
@Getter
@Setter
@NoArgsConstructor 
public class ResumeAnalysis {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "candidate_id") private Candidate candidate;
    @ManyToOne @JoinColumn(name = "job_id") private Job job;
    @Enumerated(EnumType.STRING) private AnalysisType type;
    private Integer score;
    @Column(columnDefinition = "LONGTEXT") private String content; // AI JSON output
    private LocalDateTime createdAt = LocalDateTime.now();
}
