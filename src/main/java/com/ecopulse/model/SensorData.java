package com.ecopulse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "sensor_readings")
public class SensorData {

    @Id
    private String id;
    private double humedad;
    private double temperatura;
    private double nivelLiquido;
    private String estadoTemp;
    private LocalDateTime timestamp;

    public SensorData() {
        this.timestamp = LocalDateTime.now();
    }

    public SensorData(double humedad, double temperatura, double nivelLiquido, String estadoTemp) {
        this.humedad = humedad;
        this.temperatura = temperatura;
        this.nivelLiquido = nivelLiquido;
        this.estadoTemp = estadoTemp;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getHumedad() {
        return humedad;
    }

    public void setHumedad(double humedad) {
        this.humedad = humedad;
    }

    public double getTemperatura() {
        return temperatura;
    }

    public void setTemperatura(double temperatura) {
        this.temperatura = temperatura;
    }

    public double getNivelLiquido() {
        return nivelLiquido;
    }

    public void setNivelLiquido(double nivelLiquido) {
        this.nivelLiquido = nivelLiquido;
    }

    public String getEstadoTemp() {
        return estadoTemp;
    }

    public void setEstadoTemp(String estadoTemp) {
        this.estadoTemp = estadoTemp;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
