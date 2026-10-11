package com.urbanbite.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@urbanbite.com}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otpCode, String purpose) {
        log.info("=================================================================");
        log.info("[URBANBITE OTP DISPATCH] To: {} | Purpose: {} | OTP CODE: >>> {} <<<", toEmail, purpose, otpCode);
        log.info("=================================================================");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("UrbanBite Security Verification Code: " + otpCode);
            message.setText("Dear UrbanBite Member,\n\n" +
                    "Your single-use verification code for " + purpose.toLowerCase().replace('_', ' ') + " is:\n\n" +
                    "    " + otpCode + "\n\n" +
                    "This code will expire in 10 minutes. For your security, please never share this code with anyone.\n\n" +
                    "Warm regards,\n" +
                    "UrbanBite Security Team");

            mailSender.send(message);
            log.info("Successfully dispatched OTP email via SMTP to {}", toEmail);
        } catch (Exception ex) {
            log.warn("Could not dispatch email via SMTP (using console fallback). Reason: {}", ex.getMessage());
        }
    }
}
