package com.localfix.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AIRecommendResponse {

    @JsonProperty("aiAvailable")
    private boolean aiAvailable = true;
    private String statusMessage;
    private String recommendedCategory;
    private String likelyIssue;
    private List<String> possibleCauses;
    private String severity; // LOW, MEDIUM, HIGH, URGENT
    private String urgency;  // LOW, MEDIUM, HIGH, URGENT
    private String recommendedTechnician;
    private String estimatedDuration;
    private String estimatedPriceRange;
    private String reason;
    private String disclaimer = "This AI diagnosis is an initial estimate. Final diagnosis and pricing depend on physical inspection by a verified professional.";

    public AIRecommendResponse() {}

    public AIRecommendResponse(boolean aiAvailable, String statusMessage, String recommendedCategory, String likelyIssue, List<String> possibleCauses, String severity, String urgency, String recommendedTechnician, String estimatedDuration, String estimatedPriceRange, String reason) {
        this.aiAvailable = aiAvailable;
        this.statusMessage = statusMessage;
        this.recommendedCategory = recommendedCategory;
        this.likelyIssue = likelyIssue;
        this.possibleCauses = possibleCauses;
        this.severity = severity;
        this.urgency = urgency;
        this.recommendedTechnician = recommendedTechnician;
        this.estimatedDuration = estimatedDuration;
        this.estimatedPriceRange = estimatedPriceRange;
        this.reason = reason;
    }

    public boolean isAiAvailable() { return aiAvailable; }
    public boolean getAiAvailable() { return aiAvailable; }
    public void setAiAvailable(boolean aiAvailable) { this.aiAvailable = aiAvailable; }

    public String getStatusMessage() { return statusMessage; }
    public void setStatusMessage(String statusMessage) { this.statusMessage = statusMessage; }

    public String getRecommendedCategory() { return recommendedCategory; }
    public void setRecommendedCategory(String recommendedCategory) { this.recommendedCategory = recommendedCategory; }

    public String getLikelyIssue() { return likelyIssue; }
    public void setLikelyIssue(String likelyIssue) { this.likelyIssue = likelyIssue; }

    public List<String> getPossibleCauses() { return possibleCauses; }
    public void setPossibleCauses(List<String> possibleCauses) { this.possibleCauses = possibleCauses; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }

    public String getRecommendedTechnician() { return recommendedTechnician; }
    public void setRecommendedTechnician(String recommendedTechnician) { this.recommendedTechnician = recommendedTechnician; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public String getEstimatedPriceRange() { return estimatedPriceRange; }
    public void setEstimatedPriceRange(String estimatedPriceRange) { this.estimatedPriceRange = estimatedPriceRange; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private boolean aiAvailable = true;
        private String statusMessage;
        private String recommendedCategory;
        private String likelyIssue;
        private List<String> possibleCauses;
        private String severity;
        private String urgency;
        private String recommendedTechnician;
        private String estimatedDuration;
        private String estimatedPriceRange;
        private String reason;

        public Builder aiAvailable(boolean aiAvailable) { this.aiAvailable = aiAvailable; return this; }
        public Builder statusMessage(String statusMessage) { this.statusMessage = statusMessage; return this; }
        public Builder recommendedCategory(String recommendedCategory) { this.recommendedCategory = recommendedCategory; return this; }
        public Builder likelyIssue(String likelyIssue) { this.likelyIssue = likelyIssue; return this; }
        public Builder possibleCauses(List<String> possibleCauses) { this.possibleCauses = possibleCauses; return this; }
        public Builder severity(String severity) { this.severity = severity; return this; }
        public Builder urgency(String urgency) { this.urgency = urgency; return this; }
        public Builder recommendedTechnician(String recommendedTechnician) { this.recommendedTechnician = recommendedTechnician; return this; }
        public Builder estimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; return this; }
        public Builder estimatedPriceRange(String estimatedPriceRange) { this.estimatedPriceRange = estimatedPriceRange; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }

        public AIRecommendResponse build() {
            return new AIRecommendResponse(aiAvailable, statusMessage, recommendedCategory, likelyIssue, possibleCauses, severity, urgency, recommendedTechnician, estimatedDuration, estimatedPriceRange, reason);
        }
    }
}
