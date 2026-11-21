package com.recruitment.talentsphere.entity;


import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "candidates")
@Getter @Setter @NoArgsConstructor
public class Candidate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(optional = false) @JoinColumn(name = "user_id", unique = true) private User user;
    private String phone;
    @Column(columnDefinition = "TEXT") private String skills;
    private Integer experienceYears;
    private String education;
    private String location;
    private String resumeFileName;
    @JsonIgnore @Column(columnDefinition = "LONGTEXT") private String resumeText;

    @JsonProperty("hasResume")
    public boolean hasResume() { return resumeText != null && !resumeText.isBlank(); }
}
