package com.airecruitment.talentsphereai.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "applications")
@Setter
@Getter
public class Applications {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long applicationId;

	    @ManyToOne
	    @JoinColumn(name = "candidate_id")
	    private Candidates candidate;

	    @ManyToOne
	    @JoinColumn(name = "job_id")
	    private Jobs job;

	    private LocalDate appliedDate;

	    private String applicationStatus;

	    @Column(length = 1000)
	    private String coverLetter;
	
}
