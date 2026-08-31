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
        // Persistir lectura en MongoDB Atlas (si falla por firewall/red, igual retorna datos mock)
        try {
            repository.save(data);
        } catch (Exception e) {
            System.err.println("[EcoPulse] No se pudo guardar en Mongo (firewall/red): " + e.getMessage());
        }
        return data;
    }

    @GetMapping("/history")
    public Object getHistory() {
        try {
            return repository.findTop10ByOrderByTimestampDesc();
        } catch (Exception e) {
            return java.util.Map.of("warning", "Mongo no disponible (firewall Tecsup bloquea puerto 27017)", "error", e.getMessage());
        }
    }

    @GetMapping("/ping")
    public String pingDb() {
        try {
            long count = repository.count();
            return "OK - Mongo conectado, " + count + " lecturas guardadas";
        } catch (Exception e) {
            return "WARN - Servidor OK pero Mongo no alcanzable: " + e.getMessage() + " | Tip: Tecsup bloquea puerto 27017, usa datos móviles o despliega en Render donde sí conecta";
        }
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
