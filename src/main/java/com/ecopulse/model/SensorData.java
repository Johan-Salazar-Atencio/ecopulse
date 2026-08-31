package com.ecopulse.model;

public class SensorData {

    private double humedad;
    private double temperatura;
    private double nivelLiquido;
    private String estadoTemp;

    public SensorData() {
    }

    public SensorData(double humedad, double temperatura, double nivelLiquido, String estadoTemp) {
        this.humedad = humedad;
        this.temperatura = temperatura;
        this.nivelLiquido = nivelLiquido;
        this.estadoTemp = estadoTemp;
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
}
