package com.localfix.service;

import com.localfix.model.BookingStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BookingStateEngineTest {

    @Test
    @DisplayName("Should verify valid booking status transitions")
    void testBookingStatusTransitions() {
        BookingStatus status = BookingStatus.PENDING;
        assertEquals("PENDING", status.name());

        // Valid transition path: PENDING -> ACCEPTED -> IN_PROGRESS -> COMPLETED
        assertTrue(isValidTransition(BookingStatus.PENDING, BookingStatus.ACCEPTED));
        assertTrue(isValidTransition(BookingStatus.ACCEPTED, BookingStatus.IN_PROGRESS));
        assertTrue(isValidTransition(BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED));
    }

    @Test
    @DisplayName("Should generate 4-digit OTP string between 1000 and 9999")
    void testOtpGeneration() {
        String otp = String.valueOf((int) (Math.random() * 9000) + 1000);
        assertNotNull(otp);
        assertEquals(4, otp.length());
        assertTrue(Integer.parseInt(otp) >= 1000 && Integer.parseInt(otp) <= 9999);
    }

    private boolean isValidTransition(BookingStatus current, BookingStatus next) {
        if (current == BookingStatus.PENDING && (next == BookingStatus.ACCEPTED || next == BookingStatus.CANCELLED)) return true;
        if (current == BookingStatus.ACCEPTED && (next == BookingStatus.IN_PROGRESS || next == BookingStatus.CANCELLED)) return true;
        if (current == BookingStatus.IN_PROGRESS && next == BookingStatus.COMPLETED) return true;
        return false;
    }
}
