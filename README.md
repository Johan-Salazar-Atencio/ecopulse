# EcoPulse - Dashboard IoT Compostadora Inteligente

Dashboard web para monitoreo en tiempo real de compostadora inteligente.

## Stack
- **Backend:** Java 17/21 + Spring Boot 3.2.0 (spring-boot-starter-web)
- **Frontend:** HTML5 + CSS3 Eco-Tech + Vanilla JS
- **Build:** Maven 3.9.16

## Estructura
`
src/main/java/com/ecopulse/EcoPulseApplication.java
src/main/java/com/ecopulse/model/SensorData.java
src/main/java/com/ecopulse/controller/SensorController.java
src/main/resources/static/index.html
src/main/resources/static/styles.css
src/main/resources/static/app.js
`

## Ejecutar local
``powershell
# Compilar
C:\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd clean package

# Ejecutar
java -jar target/ecopulse-1.0.0.jar
# o
C:\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd spring-boot:run
``

Abrir en Chrome: **http://localhost:8080**

API: GET http://localhost:8080/api/sensors/live

## Features
- 4 pestanas: Compostadora en Ejecucion / Agregar Nueva Composta / Aprende y Tutoriales / EcoGame
- Consumo cada 3s via `fetch('/api/sensors/live')`
- Alertas lixiviado >80%
- Formulario lotes con localStorage
- EcoGame clasificador compostables vs no compostables

Autor: Johan Salazar Atencio
