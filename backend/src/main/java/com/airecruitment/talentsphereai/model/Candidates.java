package com.airecruitment.talentsphereai.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "candidates")
@Setter
@Getter
public class Candidates {
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long candidateId;

	    @OneToOne
	    @JoinColumn(name = "user_id", unique = true)
	    private Users user;

	    private String phone;

	    private String education;

	    private Integer experienceYears;

	    private String resumeUrl;
}
