package com.localfix.repository;

import com.localfix.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByBookingIdOrderByCreatedAtAsc(Long bookingId);
    List<Message> findByRecipientIdAndReadStatusFalse(Long recipientId);
}
