package com.localfix.dto.ai;

public class AIRecommendResponse {
    private String recommendedCategory;
    private String urgency;
    private String estimatedDuration;
    private String estimatedPriceRange;
    private String reason;

    public AIRecommendResponse() {}

    public AIRecommendResponse(String recommendedCategory, String urgency, String estimatedDuration, String estimatedPriceRange, String reason) {
        this.recommendedCategory = recommendedCategory;
        this.urgency = urgency;
        this.estimatedDuration = estimatedDuration;
        this.estimatedPriceRange = estimatedPriceRange;
        this.reason = reason;
    }

    public String getRecommendedCategory() { return recommendedCategory; }
    public void setRecommendedCategory(String recommendedCategory) { this.recommendedCategory = recommendedCategory; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public String getEstimatedPriceRange() { return estimatedPriceRange; }
    public void setEstimatedPriceRange(String estimatedPriceRange) { this.estimatedPriceRange = estimatedPriceRange; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String recommendedCategory;
        private String urgency;
        private String estimatedDuration;
        private String estimatedPriceRange;
        private String reason;

        public Builder recommendedCategory(String recommendedCategory) { this.recommendedCategory = recommendedCategory; return this; }
        public Builder urgency(String urgency) { this.urgency = urgency; return this; }
        public Builder estimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public Builder estimatedPriceRange(String estimatedPriceRange) { this.estimatedPriceRange = estimatedPriceRange; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }

        public AIRecommendResponse build() {
            return new AIRecommendResponse(recommendedCategory, urgency, estimatedDuration, estimatedPriceRange, reason);
        }
    }
}
