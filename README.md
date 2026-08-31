# EcoPulse - Dashboard IoT Compostadora Inteligente

Dashboard web para monitoreo en tiempo real de una compostadora inteligente, con persistencia en **MongoDB Atlas**.

## Stack
- **Backend:** Java 17/21 + Spring Boot 3.2.0 (spring-boot-starter-web + spring-boot-starter-data-mongodb)
- **Base de datos:** MongoDB Atlas (NoSQL)
- **Frontend:** HTML5 + CSS3 Eco-Tech + Vanilla JS
- **Build:** Maven 3.9.16
- **Deploy:** Backend en Render (Docker) • Frontend en Vercel (estática)

## Estructura
```
src/main/java/com/ecopulse/EcoPulseApplication.java
src/main/java/com/ecopulse/model/SensorData.java          <- @Document Mongo
src/main/java/com/ecopulse/repository/SensorDataRepository.java  <- MongoRepository
src/main/java/com/ecopulse/controller/SensorController.java       <- REST + CORS
src/main/resources/application.properties                 <- MONGODB_URI env var
src/main/resources/static/                                <- frontend (Spring Boot local)
public/                                                   <- frontend (Vercel)
Dockerfile                                                <- build imagen Spring Boot
render.yaml                                               <- blueprint deploy Render
vercel.json                                               <- config frontend Vercel
.env.example                                              <- ejemplo variables de entorno
```

## 1. Conexión a MongoDB Atlas

1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratis M0).
2. En **Database Access** crea un usuario con password.
3. En **Network Access** agrega `0.0.0.0/0` (acceso desde cualquier IP, necesario para Upload a Render).
4. Copia tu connection string de **Connect → Drivers → Java**.

Configura la variable de entorno (nunca subas tu password al repo):

```powershell
# Windows PowerShell - set en tu sesion (o usa .env con tu IDE)
$env:MONGODB_URI="mongodb+srv://TU_USUARIO:TU_PASSWORD@TU_CLUSTER.mongodb.net/ecopulse?retryWrites=true&w=majority"
```

Sin la variable, la app usa `mongodb://localhost:27017/ecopulse` como fallback.

## 2. Ejecutar local

```powershell
# Compilar
C:\apache-maven-3.9.16-bin\apache-maven-3.9.16\bin\mvn.cmd clean package

# Ejecutar (con MONGODB_URI definida arriba)
java -jar target/ecopulse-1.0.0.jar
```

Abrir en Chrome: **http://localhost:8080**

## 3. Endpoints
- `GET /api/sensors/live` → lectura actual (se persiste en Mongo)
- `GET /api/sensors/history` → últimas 10 lecturas
- `GET /api/sensors/ping` → health check (verifica conexión a Mongo)

## 4. Deploy Backend en Render

1. Sube el repo a GitHub.
2. En [dashboard.render.com](https://dashboard.render.com) → **New → Blueprint**.
3. Conecta tu repo (usa `render.yaml` detectado automáticamente).
4. Agrega la variable de entorno `MONGODB_URI` con tu connection string real.
5. Click **Apply** → espera el deploy. Te dará una URL tipo `https://ecopulse-backend.onrender.com`.

## 5. Deploy Frontend en Vercel

1. En [vercel.com](https://vercel.com) → **New Project** → conecta el repo.
2. Frameworks: *Other*, Build: vacío, Output: `public` (configurado en `vercel.json`).
3. Deploy. Te dará una URL tipo `https://ecopulse.vercel.app`.

> En `public/app.js`, ajusta la constante `API_BASE` a la URL de tu backend en Render.

## Features
- 4 pestañas: Compostadora en Ejecución / Agregar Nueva Composta / Aprende y Tutoriales / EcoGame
- Consumo cada 3s vía `fetch('/api/sensors/live')`
- Persistencia de lecturas en MongoDB Atlas
- Alertas lixiviado >80%
- Formulario lotes con localStorage
- EcoGame clasificador compostables vs no compostables

Autor: Johan Salazar Atencio
