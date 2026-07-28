package com.localfix.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    private String transactionRef;

    @Column(nullable = false)
    private BigDecimal amount;

    private LocalDateTime paidAt;

    public Payment() {}

    public Payment(Long id, Booking booking, PaymentMethod method, PaymentStatus status, String transactionRef, BigDecimal amount, LocalDateTime paidAt) {
        this.id = id;
        this.booking = booking;
        this.method = method;
        this.status = status;
        this.transactionRef = transactionRef;
        this.amount = amount;
        this.paidAt = paidAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public PaymentMethod getMethod() { return method; }
    public void setMethod(PaymentMethod method) { this.method = method; }

    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Booking booking;
        private PaymentMethod method;
        private PaymentStatus status;
        private String transactionRef;
        private BigDecimal amount;
        private LocalDateTime paidAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder booking(Booking booking) { this.booking = booking; return this; }
        public Builder method(PaymentMethod method) { this.method = method; return this; }
        public Builder status(PaymentStatus status) { this.status = status; return this; }
        public Builder transactionRef(String transactionRef) { this.transactionRef = transactionRef; return this; }
        public Builder amount(BigDecimal amount) { this.amount = amount; return this; }
        public Builder paidAt(LocalDateTime paidAt) { this.paidAt = paidAt; return this; }

        public Payment build() {
            return new Payment(id, booking, method, status, transactionRef, amount, paidAt);
        }
    }
}
