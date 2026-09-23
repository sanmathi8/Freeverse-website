package dev.freeverse.service;

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

    @Value("${spring.mail.username:noreply@freeverse.dev}")
    private String mailFrom;

    @Value("${app.client-url:http://localhost:5173}")
    private String clientUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String username, String token) {
        String verificationUrl = clientUrl + "/#verify-email?token=" + token;
        String subject = "Verify your Freeverse Account";
        String content = "Hello " + username + ",\n\n"
                + "Thank you for joining Freeverse! Please verify your email address by clicking the link below:\n\n"
                + verificationUrl + "\n\n"
                + "If you did not create this account, please ignore this email.";

        sendEmailOrLog(toEmail, subject, content);
    }

    public void sendPasswordResetEmail(String toEmail, String username, String token) {
        String resetUrl = clientUrl + "/#reset-password?token=" + token;
        String subject = "Reset your Freeverse Password";
        String content = "Hello " + username + ",\n\n"
                + "You requested a password reset. Click the link below to set a new password:\n\n"
                + resetUrl + "\n\n"
                + "This link will expire in 24 hours. If you did not request a password reset, please ignore this email.";

        sendEmailOrLog(toEmail, subject, content);
    }

    private void sendEmailOrLog(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email successfully dispatched to {}", to);
        } catch (Exception e) {
            log.warn("SMTP host not reachable, logging email content for development testing:\nTo: {}\nSubject: {}\nContent:\n{}", to, subject, text);
        }
    }
}
