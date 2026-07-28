package com.localfix.controller;

import com.localfix.dto.ai.AIRecommendRequest;
import com.localfix.dto.ai.AIRecommendResponse;
import com.localfix.service.AIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Recommender", description = "AI and rule-based service recommendation endpoint")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/recommend-service")
    @Operation(summary = "Recommend service based on problem description")
    public ResponseEntity<AIRecommendResponse> recommendService(@Valid @RequestBody AIRecommendRequest request) {
        return ResponseEntity.ok(aiService.recommendService(request));
    }
}
