package com.localfix.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RootController {

    @GetMapping({"/", "/api", "/api/v1/health"})
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "message", "LocalFix AI Hyperlocal Marketplace API Service is Running",
            "version", "1.0.0",
            "docs", "/swagger-ui.html"
        ));
    }
}
