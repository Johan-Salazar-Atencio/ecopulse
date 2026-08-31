package com.ecopulse.controller;

import com.ecopulse.model.SensorData;
import com.ecopulse.repository.SensorDataRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/sensors")
@CrossOrigin(origins = {
        "http://localhost:8080",
        "http://localhost:3000",
        "https://ecopulse.vercel.app",
        "https://ecopulse-ecopulse.vercel.app"
})
public class SensorController {

    private final SensorDataRepository repository;

    public SensorController(SensorDataRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/live")
    public SensorData getLiveData() {
        SensorData data = generateRandomData();
        // Persistir lectura en MongoDB Atlas
        repository.save(data);
        return data;
    }

    @GetMapping("/history")
    public List<SensorData> getHistory() {
        return repository.findTop10ByOrderByTimestampDesc();
    }

    @GetMapping("/ping")
    public String pingDb() {
        long count = repository.count();
        return "OK - Mongo conectado, " + count + " lecturas guardadas";
    }

    private SensorData generateRandomData() {
        double humedad = Math.round((45 + ThreadLocalRandom.current().nextDouble() * 30) * 10.0) / 10.0;
        double temperatura = Math.round((35 + ThreadLocalRandom.current().nextDouble() * 30) * 10.0) / 10.0;
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
