package com.web.equipe5.manutencaoequipamentos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ManutencaoequipamentosApplication {

	public static void main(String[] args) {
		SpringApplication.run(ManutencaoequipamentosApplication.class, args);
	}

}
