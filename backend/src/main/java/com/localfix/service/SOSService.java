package com.localfix.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class SOSService {

    public Map<String, Object> triggerEmergencySOS(Long userId, String issueCategory, String address, String notes) {
        Map<String, Object> sos = new HashMap<>();
        sos.put("sosId", "SOS-" + System.currentTimeMillis());
        sos.put("userId", userId);
        sos.put("category", issueCategory != null ? issueCategory : "Major Water Leakage / Electrical Hazard");
        sos.put("address", address);
        sos.put("status", "PRIORITY_DISPATCHED");
        sos.put("etaMinutes", "15-25 mins");
        sos.put("assignedTechnician", "Express Emergency Response Team #4");
        sos.put("contactNumber", "+91 9800011122");
        sos.put("safetyInstructions", Arrays.asList(
                "If electrical sparking occurs, immediately switch off main circuit breaker.",
                "Turn off main water supply valve if pipe is actively leaking.",
                "Maintain safe distance from exposed wires or standing water."
        ));
        return sos;
    }
}
