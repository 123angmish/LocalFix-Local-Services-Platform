package com.localfix.service;

import com.localfix.dto.ai.AIRecommendRequest;
import com.localfix.dto.ai.AIRecommendResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AIService {

    @Value("${app.ai.api-key:}")
    private String apiKey;

    public AIRecommendResponse recommendService(AIRecommendRequest request) {
        String problemText = request.getProblem() != null ? request.getProblem().toLowerCase(Locale.ROOT) : "";

        // Intelligent Rule-Based Recommender (and fallback when no API key is provided)
        if (problemText.contains("leak") || problemText.contains("pipe") || problemText.contains("sink")
                || problemText.contains("tap") || problemText.contains("drain") || problemText.contains("toilet")
                || problemText.contains("plumb")) {
            boolean highUrgency = problemText.contains("overflow") || problemText.contains("spread")
                    || problemText.contains("burst") || problemText.contains("emergency");

            return AIRecommendResponse.builder()
                    .recommendedCategory("Plumber")
                    .urgency(highUrgency ? "High" : "Medium")
                    .estimatedDuration("1-2 hours")
                    .estimatedPriceRange("₹300-₹700")
                    .reason(highUrgency
                            ? "Leakage and water spreading requires immediate plumbing support to avoid damage."
                            : "Plumbing issue detected in pipes or fixtures.")
                    .build();
        }

        if (problemText.contains("electric") || problemText.contains("wire") || problemText.contains("spark")
                || problemText.contains("short circuit") || problemText.contains("switch") || problemText.contains("fuse")
                || problemText.contains("fan") || problemText.contains("light")) {
            boolean highUrgency = problemText.contains("spark") || problemText.contains("smoke") || problemText.contains("fire");

            return AIRecommendResponse.builder()
                    .recommendedCategory("Electrician")
                    .urgency(highUrgency ? "High" : "Medium")
                    .estimatedDuration("1-1.5 hours")
                    .estimatedPriceRange("₹250-₹600")
                    .reason(highUrgency
                            ? "Electrical sparks or wiring issues pose safety hazards and require quick intervention."
                            : "Electrical component repair required.")
                    .build();
        }

        if (problemText.contains("clean") || problemText.contains("dust") || problemText.contains("mop")
                || problemText.contains("sofa") || problemText.contains("carpet") || problemText.contains("deep clean")
                || problemText.contains("stain") || problemText.contains("dirty")) {
            return AIRecommendResponse.builder()
                    .recommendedCategory("Cleaner")
                    .urgency("Low")
                    .estimatedDuration("2-4 hours")
                    .estimatedPriceRange("₹500-₹1500")
                    .reason("Deep cleaning and sanitation recommended for home hygiene.")
                    .build();
        }

        if (problemText.contains("ac") || problemText.contains("fridge") || problemText.contains("refrigerator")
                || problemText.contains("washing machine") || problemText.contains("microwave") || problemText.contains("tv")
                || problemText.contains("appliance") || problemText.contains("oven")) {
            return AIRecommendResponse.builder()
                    .recommendedCategory("Appliance Repair")
                    .urgency("Medium")
                    .estimatedDuration("1-2 hours")
                    .estimatedPriceRange("₹400-₹1000")
                    .reason("Home appliance troubleshooting and component replacement needed.")
                    .build();
        }

        if (problemText.contains("hair") || problemText.contains("facial") || problemText.contains("massage")
                || problemText.contains("salon") || problemText.contains("spa") || problemText.contains("makeup")
                || problemText.contains("grooming") || problemText.contains("waxing")) {
            return AIRecommendResponse.builder()
                    .recommendedCategory("Salon")
                    .urgency("Low")
                    .estimatedDuration("1-2.5 hours")
                    .estimatedPriceRange("₹350-₹1200")
                    .reason("Personal grooming and relaxation salon service at home.")
                    .build();
        }

        if (problemText.contains("math") || problemText.contains("tutor") || problemText.contains("study")
                || problemText.contains("exam") || problemText.contains("physics") || problemText.contains("class")
                || problemText.contains("teach") || problemText.contains("subject")) {
            return AIRecommendResponse.builder()
                    .recommendedCategory("Tutor")
                    .urgency("Low")
                    .estimatedDuration("1 hour/session")
                    .estimatedPriceRange("₹400-₹800")
                    .reason("Academic home tutoring session for subject learning and guidance.")
                    .build();
        }

        // Generic default recommendation
        return AIRecommendResponse.builder()
                .recommendedCategory("General Maintenance")
                .urgency("Medium")
                .estimatedDuration("1-2 hours")
                .estimatedPriceRange("₹300-₹800")
                .reason("Based on your issue description, a professional technician can inspect and resolve the issue.")
                .build();
    }
}
