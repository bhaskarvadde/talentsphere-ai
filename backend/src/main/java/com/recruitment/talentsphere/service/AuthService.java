package com.recruitment.talentsphere.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.recruitment.talentsphere.dto.Dtos.AuthRes;
import com.recruitment.talentsphere.dto.Dtos.LoginReq;
import com.recruitment.talentsphere.dto.Dtos.RegisterReq;
import com.recruitment.talentsphere.entity.Candidate;
import com.recruitment.talentsphere.entity.Enums.Role;
import com.recruitment.talentsphere.entity.User;
import com.recruitment.talentsphere.repository.CandidateRepo;
import com.recruitment.talentsphere.repository.UserRepo;
import com.recruitment.talentsphere.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepo users;
    private final CandidateRepo candidates;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    @Transactional
    public AuthRes register(RegisterReq r) {
        String email = r.email().toLowerCase();
        if (users.existsByEmail(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        User u = new User();
        u.setName(r.name()); u.setEmail(email); u.setPassword(encoder.encode(r.password()));
        u.setRole(r.role()); u.setCompany(r.company());
        users.save(u);
        if (r.role() == Role.CANDIDATE) {
            Candidate c = new Candidate(); c.setUser(u); candidates.save(c);
        }
        return new AuthRes(jwt.generate(u), u.getName(), u.getEmail(), u.getRole().name());
    }

    public AuthRes login(LoginReq r) {
        User u = users.findByEmail(r.email().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!encoder.matches(r.password(), u.getPassword()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        return new AuthRes(jwt.generate(u), u.getName(), u.getEmail(), u.getRole().name());
    }
}
