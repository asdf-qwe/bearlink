package com.project.bearlink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BearlinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(BearlinkApplication.class, args);
	}

}
