package dev.freeverse.service;

import dev.freeverse.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${mail.from:noreply@freeverse.dev}")
    private String mailFrom;

    @Value("${app.client-url:http://localhost:5173}")
    private String clientUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCodeEmail(String toEmail, String username, String code) {
        String subject = "Freeverse Account Verification Code: " + code;
        String content = "Hello " + username + ",\n\n"
                + "Thank you for joining Freeverse!\n\n"
                + "Your 6-digit email confirmation code is:\n\n"
                + "   " + code + "\n\n"
                + "Please enter this confirmation code in the Freeverse application to verify your email address.\n\n"
                + "This verification code will expire in 24 hours. If you did not create a Freeverse account, please ignore this email.";

        sendEmail(toEmail, subject, content);
    }

    public void sendPasswordResetEmail(String toEmail, String username, String token) {
        String resetUrl = clientUrl + "/#reset-password?token=" + token;
        String subject = "Reset your Freeverse Password";
        String content = "Hello " + username + ",\n\n"
                + "You requested a password reset. Click the link below to set a new password:\n\n"
                + resetUrl + "\n\n"
                + "This link will expire in 24 hours. If you did not request a password reset, please ignore this email.";

        sendEmail(toEmail, subject, content);
    }

    private void sendEmail(String to, String subject, String text) {
        if (mailUsername == null || mailUsername.trim().isEmpty()) {
            log.warn("SMTP credentials (MAIL_USERNAME) not configured. Real email dispatch to {} skipped. Email content:\n{}", to, text);
            throw new BadRequestException("Email verification dispatch failed: SMTP credentials (MAIL_USERNAME/MAIL_PASSWORD) are not configured on the backend server. Please set MAIL_USERNAME and MAIL_PASSWORD in backend environment variables.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom != null && !mailFrom.isEmpty() ? mailFrom : mailUsername);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email verification code successfully sent via SMTP to {}", to);
        } catch (Exception e) {
            log.error("Failed to deliver email to {}: {}", to, e.getMessage(), e);
            throw new BadRequestException("Email delivery failed via SMTP server: " + e.getMessage() + ". Please verify SMTP server settings.");
        }
    }
}
