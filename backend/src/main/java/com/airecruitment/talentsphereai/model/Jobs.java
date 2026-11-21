package com.airecruitment.talentsphereai.model;

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
@Table(name = "jobs")
@Setter
@Getter
public class Jobs {

	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long jobId;

	    @ManyToOne
	    @JoinColumn(name = "recruiter_id")
	    private Users recruiter;

	    private String jobTitle;

	    @Column(length = 2000)
	    private String description;

	    private String requiredSkills;

	    private Integer experienceRequired;
}
