package com.localfix.config;

import org.slf.Logger;
import org.slf.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

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

        // Auto-fix Render/Heroku postgresql:// connection strings
        if (dbUrl != null && dbUrl.startsWith("postgresql://")) {
            formattedUrl = "jdbc:" + dbUrl;
            driverClass = "org.postgresql.Driver";
            logger.info("Transformed Render postgresql:// URL to JDBC format: {}", formattedUrl);
        } else if (dbUrl != null && dbUrl.contains("postgresql")) {
            driverClass = "org.postgresql.Driver";
        }

        return DataSourceBuilder.create()
                .url(formattedUrl)
                .username(username)
                .password(password)
                .driverClassName(driverClass)
                .build();
    }
}
