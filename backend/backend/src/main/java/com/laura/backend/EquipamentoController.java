package com.laura.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EquipamentoController {

 @GetMapping("/equipamentos")
    public String[] listarEquipamentos() {
        return new String[] { "Máquina A", "Máquina B", "Máquina C" };
    }
}