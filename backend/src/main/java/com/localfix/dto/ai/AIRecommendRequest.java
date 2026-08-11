package com.localfix.dto.ai;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AIRecommendRequest {

    @NotBlank(message = "Problem description is required")
    private String problem;

    private String category;

    private List<String> imageUrls;

    public AIRecommendRequest() {}

    public AIRecommendRequest(String problem, String category, List<String> imageUrls) {
        this.problem = problem;
        this.category = category;
        this.imageUrls = imageUrls;
    }

    public String getProblem() { return problem; }
    public void setProblem(String problem) { this.problem = problem; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}
