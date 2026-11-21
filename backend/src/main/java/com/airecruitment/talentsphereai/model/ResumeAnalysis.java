package com.airecruitment.talentsphereai.model;




import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "resume_analysis")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long analysisId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidates candidate;

    private String resumeFileName;

    @Column(length = 2000)
    private String extractedSkills;

    @Column(length = 2000)
    private String experienceSummary;

    private Double overallScore;
}
