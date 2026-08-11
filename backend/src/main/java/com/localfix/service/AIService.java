package com.localfix.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.localfix.dto.ai.AIRecommendRequest;
import com.localfix.dto.ai.AIRecommendResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIService {

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Value("${app.ai.model:gemini-1.5-flash}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIRecommendResponse recommendService(AIRecommendRequest request) {
        // 1. Strict AI Service Availability Check (Never return fake responses when API key is missing)
        if (apiKey == null || apiKey.trim().isEmpty() || "none".equalsIgnoreCase(apiKey.trim())) {
            return AIRecommendResponse.builder()
                    .aiAvailable(false)
                    .statusMessage("AI service unavailable")
                    .reason("No external AI API key configured in environment variables (AI_API_KEY).")
                    .build();
        }

        try {
            // 2. Multimodal / Text LLM API Integration (Gemini Interactions API Endpoint)
            String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

            String systemPrompt = "You are LocalFix AI repair diagnosis engine. Analyze the repair problem description and return a strictly formatted JSON object with fields: "
                    + "\"recommendedCategory\" (AC Repair, Electrician, Plumber, Cleaner, Appliance Repair, Salon, or Tutor), "
                    + "\"likelyIssue\", \"possibleCauses\" (array of strings), \"severity\" (LOW, MEDIUM, HIGH, URGENT), "
                    + "\"urgency\" (LOW, MEDIUM, HIGH, URGENT), \"recommendedTechnician\", \"estimatedDuration\", \"estimatedPriceRange\", \"reason\".";

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", systemPrompt + "\nCustomer Problem: " + request.getProblem() + (request.getCategory() != null ? " (Category hint: " + request.getCategory() + ")" : ""));

            List<Map<String, Object>> parts = new ArrayList<>();
            parts.add(textPart);

            Map<String, Object> contentNode = new HashMap<>();
            contentNode.put("parts", parts);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(contentNode));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String responseText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

                // Extract JSON substring if LLM wrapped output in markdown codeblock
                if (responseText.contains("```json")) {
                    responseText = responseText.substring(responseText.indexOf("```json") + 7);
                    if (responseText.contains("```")) {
                        responseText = responseText.substring(0, responseText.indexOf("```"));
                    }
                }

                JsonNode parsedJson = objectMapper.readTree(responseText.trim());

                List<String> causesList = new ArrayList<>();
                if (parsedJson.has("possibleCauses") && parsedJson.get("possibleCauses").isArray()) {
                    for (JsonNode cause : parsedJson.get("possibleCauses")) {
                        causesList.add(cause.asText());
                    }
                }

                return AIRecommendResponse.builder()
                        .aiAvailable(true)
                        .statusMessage("AI diagnosis generated successfully.")
                        .recommendedCategory(parsedJson.path("recommendedCategory").asText("General Maintenance"))
                        .likelyIssue(parsedJson.path("likelyIssue").asText("Inspection Required"))
                        .possibleCauses(causesList.isEmpty() ? Collections.singletonList("Component wear or improper fitting") : causesList)
                        .severity(parsedJson.path("severity").asText("MEDIUM"))
                        .urgency(parsedJson.path("urgency").asText("MEDIUM"))
                        .recommendedTechnician(parsedJson.path("recommendedTechnician").asText("Certified Specialist"))
                        .estimatedDuration(parsedJson.path("estimatedDuration").asText("1-2 hours"))
                        .estimatedPriceRange(parsedJson.path("estimatedPriceRange").asText("₹300 - ₹800"))
                        .reason(parsedJson.path("reason").asText("AI analysis based on provided symptoms."))
                        .build();
            }
        } catch (Exception e) {
            System.err.println("External AI API Call Failed: " + e.getMessage());
        }

        // Failure Fallback
        return AIRecommendResponse.builder()
                .aiAvailable(false)
                .statusMessage("AI service unavailable")
                .reason("Failed to connect to external LLM API service.")
                .build();
    }
}
