package com.recruitment.talentsphere.dto;

import com.recruitment.talentsphere.entity.Enums.AppStatus;
import com.recruitment.talentsphere.entity.Enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class Dtos {
    public record RegisterReq(@NotBlank String name, @NotBlank @Email String email,
                              @NotBlank @Size(min = 6) String password, @NotNull Role role, String company) {}
    public record LoginReq(@NotBlank String email, @NotBlank String password) {}
    public record AuthRes(String token, String name, String email, String role) {}
    public record JobReq(@NotBlank String title, @NotBlank String description, String requiredSkills,
                         String location, Integer experienceRequired, String salaryRange) {}
    public record StatusReq(@NotNull AppStatus status) {}
    public record ProfileReq(String phone, String skills, Integer experienceYears, String education, String location) {}
}