package com.localfix.controller;

import com.localfix.model.Message;
import com.localfix.repository.MessageRepository;
import com.localfix.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messaging", description = "Endpoints for Persistent Booking Chat")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping("/booking/{bookingId}")
    @Operation(summary = "Get all messages for a specific booking")
    public ResponseEntity<List<Message>> getBookingMessages(@PathVariable Long bookingId) {
        return ResponseEntity.ok(messageRepository.findByBookingIdOrderByCreatedAtAsc(bookingId));
    }

    @PostMapping
    @Operation(summary = "Send a persistent message attached to a booking")
    public ResponseEntity<Message> sendMessage(@AuthenticationPrincipal UserPrincipal principal, @RequestBody Message request) {
        if (principal != null) {
            request.setSenderId(principal.getId());
            request.setSenderName(principal.getUsername());
        }
        return ResponseEntity.ok(messageRepository.save(request));
    }
}
