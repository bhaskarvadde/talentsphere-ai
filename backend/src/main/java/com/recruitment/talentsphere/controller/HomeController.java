package com.recruitment.talentsphere.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
                "app", "TalentSphere AI - Recruitment API",
                "status", "running",
                "docs", "/swagger-ui.html");
    }
}
