package com.recruitment.talentsphere.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recruitment.talentsphere.dto.Dtos.AuthRes;
import com.recruitment.talentsphere.dto.Dtos.LoginReq;
import com.recruitment.talentsphere.dto.Dtos.RegisterReq;
import com.recruitment.talentsphere.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final AuthService auth;

    @PostMapping("/register") public AuthRes register(@Valid @RequestBody RegisterReq r) { return auth.register(r); }
    @PostMapping("/login") public AuthRes login(@Valid @RequestBody LoginReq r) { return auth.login(r); }
}
