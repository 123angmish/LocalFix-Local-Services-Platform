package com.localfix.dto.ai;

import jakarta.validation.constraints.NotBlank;

public class AIRecommendRequest {

    @NotBlank(message = "Problem description is required")
    private String problem;

    public AIRecommendRequest() {}

    public AIRecommendRequest(String problem) {
        this.problem = problem;
    }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }
}
