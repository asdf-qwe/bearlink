package com.project.bearlink;

import com.project.bearlink.global.security.jwt.JwtProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@EnableConfigurationProperties(JwtProperties.class)
public class BearlinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(BearlinkApplication.class, args);
	}

}
