package com.localfix.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @Value("${spring.datasource.username:sa}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:org.h2.Driver}")
    private String defaultDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        String formattedUrl = dbUrl;
        String driverClass = defaultDriver;
        String finalUsername = username;
        String finalPassword = password;

        if (dbUrl != null && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("jdbc:postgresql://"))) {
            driverClass = "org.postgresql.Driver";

            if (dbUrl.contains("@")) {
                try {
                    String clean = dbUrl.replace("jdbc:postgresql://", "").replace("postgresql://", "");
                    String[] parts = clean.split("@");
                    String userPass = parts[0];
                    String hostDb = parts[1];

                    if (userPass.contains(":")) {
                        String[] creds = userPass.split(":");
                        finalUsername = creds[0];
                        finalPassword = creds[1];
                    } else {
                        finalUsername = userPass;
                    }

                    formattedUrl = "jdbc:postgresql://" + hostDb;
                    System.out.println("Parsed Render Database URL: " + formattedUrl + " (User: " + finalUsername + ")");
                } catch (Exception e) {
                    System.err.println("Failed to parse postgresql URL: " + e.getMessage());
                }
            } else if (!dbUrl.startsWith("jdbc:")) {
                formattedUrl = "jdbc:" + dbUrl;
            }
        }

        return DataSourceBuilder.create()
                .url(formattedUrl)
                .username(finalUsername)
                .password(finalPassword)
                .driverClassName(driverClass)
                .build();
    }
}
