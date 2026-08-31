package com.ecopulse.controller;

import com.ecopulse.model.SensorData;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/sensors")
public class SensorController {

    private final Random random = new Random();

    @GetMapping("/live")
    public SensorData getLiveData() {
        // Humedad realista: 45% - 75% (óptimo compostaje 50-60%)
        double humedad = Math.round((45 + ThreadLocalRandom.current().nextDouble() * 30) * 10.0) / 10.0;

        // Temperatura realista: 35°C - 65°C (fase termófila 45-65)
        double temperatura = Math.round((35 + ThreadLocalRandom.current().nextDouble() * 30) * 10.0) / 10.0;

        // Nivel de lixiviado: 10% - 95% (para probar alerta >80%)
        double nivelLiquido = Math.round((10 + ThreadLocalRandom.current().nextDouble() * 85) * 10.0) / 10.0;

        String estadoTemp;
        if (temperatura < 40) {
            estadoTemp = "Fase Mesófila - Inicial";
        } else if (temperatura < 55) {
            estadoTemp = "Fase Termófila - Activa";
        } else if (temperatura < 62) {
            estadoTemp = "Fase Termófila - Óptima";
        } else {
            estadoTemp = "Alerta: Temperatura Alta";
        }

        return new SensorData(humedad, temperatura, nivelLiquido, estadoTemp);
    }
}
