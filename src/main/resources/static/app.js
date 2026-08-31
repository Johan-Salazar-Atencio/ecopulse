// EcoPulse - Dashboard Logic

// ===== Navegación Sidebar =====
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
    });
});

// ===== Sensor Live Data (fetch cada 3s) =====
const humedadValue = document.getElementById('humedad-value');
const humedadBar = document.getElementById('humedad-bar');
const temperaturaValue = document.getElementById('temperatura-value');
const temperaturaBar = document.getElementById('temperatura-bar');
const estadoTemp = document.getElementById('estado-temp');
const lixiviadoValue = document.getElementById('lixiviado-value');
const lixiviadoBar = document.getElementById('lixiviado-bar');
const alertContainer = document.getElementById('alert-container');
const lastUpdate = document.getElementById('last-update');
const tiempoActivo = document.getElementById('tiempo-activo');
const recomendacion = document.getElementById('recomendacion');

const startTime = Date.now();

function updateTiempoActivo() {
    const diff = Date.now() - startTime;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    tiempoActivo.textContent = `${hrs}h ${mins}m ${secs}s`;
}
setInterval(updateTiempoActivo, 1000);

async function fetchSensorData() {
    try {
        const res = await fetch('/api/sensors/live');
        if (!res.ok) throw new Error('Error fetching');
        const data = await res.json();
        renderSensors(data);
    } catch (e) {
        console.warn('Fallo fetch sensores, usando datos mock locales', e);
        // Fallback mock si el backend no está disponible (útil en preview sin servidor)
        const mock = {
            humedad: +(45 + Math.random() * 30).toFixed(1),
            temperatura: +(35 + Math.random() * 30).toFixed(1),
            nivelLiquido: +(10 + Math.random() * 85).toFixed(1),
            estadoTemp: 'Fase Termófila - Activa'
        };
        if (mock.temperatura < 40) mock.estadoTemp = 'Fase Mesófila - Inicial';
        else if (mock.temperatura < 55) mock.estadoTemp = 'Fase Termófila - Activa';
        else if (mock.temperatura < 62) mock.estadoTemp = 'Fase Termófila - Óptima';
        else mock.estadoTemp = 'Alerta: Temperatura Alta';
        renderSensors(mock);
    }
}

function renderSensors(data) {
    const humedad = data.humedad;
    const temperatura = data.temperatura;
    const nivelLiquido = data.nivelLiquido;

    humedadValue.textContent = humedad.toFixed(1);
    humedadBar.style.width = Math.min(humedad, 100) + '%';

    temperaturaValue.textContent = temperatura.toFixed(1);
    // escala 0-80°C -> porcentaje
    temperaturaBar.style.width = Math.min((temperatura / 80) * 100, 100) + '%';
    estadoTemp.textContent = data.estadoTemp;

    lixiviadoValue.textContent = nivelLiquido.toFixed(1);
    lixiviadoBar.style.width = Math.min(nivelLiquido, 100) + '%';

    lastUpdate.textContent = new Date().toLocaleTimeString('es-PE');

    // Alertas
    alertContainer.innerHTML = '';
    if (nivelLiquido > 80) {
        lixiviadoBar.classList.add('alert');
        alertContainer.innerHTML += `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle"></i>
                <span>¡Alerta Crítica! Nivel de lixiviado al ${nivelLiquido.toFixed(1)}% — Drena el depósito inmediatamente para evitar anaerobiosis.</span>
            </div>`;
    } else {
        lixiviadoBar.classList.remove('alert');
        if (nivelLiquido > 60) {
            alertContainer.innerHTML += `
            <div class="alert alert-warning">
                <i class="fas fa-info-circle"></i>
                <span>Advertencia: Lixiviado al ${nivelLiquido.toFixed(1)}% — Programa drenaje en las próximas 24h.</span>
            </div>`;
        }
    }

    if (data.estadoTemp.includes('Alta')) {
        alertContainer.innerHTML += `
            <div class="alert alert-danger">
                <i class="fas fa-temperature-high"></i>
                <span>Temperatura elevada (${temperatura.toFixed(1)}°C) — Voltea la composta y verifica humedad.</span>
            </div>`;
    }

    if (alertContainer.innerHTML === '') {
        alertContainer.innerHTML = `
            <div class="alert alert-success">
                <i class="fas fa-check-circle"></i>
                <span>Sistema estable — Parámetros dentro de rangos óptimos.</span>
            </div>`;
    }

    // Recomendación dinámica
    let rec = '';
    if (humedad < 50) rec = 'Humedad baja: riega ligeramente y añade restos verdes.';
    else if (humedad > 65) rec = 'Humedad alta: añade material marrón (cartón, hojas secas) y voltea.';
    else if (temperatura > 60) rec = 'Temperatura muy alta: voltea para liberar calor.';
    else if (nivelLiquido > 80) rec = 'Drena lixiviados y úsalos diluidos 1:10 como fertilizante.';
    else rec = 'Condiciones óptimas. Mantén volteo cada 3-5 días.';
    recomendacion.textContent = rec;
}

fetchSensorData();
setInterval(fetchSensorData, 3000);

// ===== Formulario Dinámico de Lotes =====
const form = document.getElementById('composta-form');
const lotesList = document.getElementById('lotes-list');
let lotes = JSON.parse(localStorage.getItem('ecopulse_lotes') || '[]');

function renderLotes() {
    if (lotes.length === 0) {
        lotesList.innerHTML = '<p class="empty-message">No hay lotes registrados aún. ¡Agrega el primero!</p>';
        return;
    }
    lotesList.innerHTML = lotes.map((l, idx) => `
        <div class="lote-card">
            <div>
                <h4><i class="fas fa-seedling"></i> ${l.nombre}</h4>
                <p>${l.tipo} • ${l.peso} kg • Inicio: ${l.fecha} ${l.notas ? '• ' + l.notas : ''}</p>
            </div>
            <div style="display:flex; gap:8px; align-items:center">
                <span class="lote-badge">#${String(idx+1).padStart(2,'0')}</span>
                <button onclick="eliminarLote(${idx})" style="background:#FFEBEE; border:1px solid #EF9A9A; color:#C62828; border-radius:6px; padding:6px 8px; cursor:pointer"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

window.eliminarLote = (idx) => {
    lotes.splice(idx, 1);
    localStorage.setItem('ecopulse_lotes', JSON.stringify(lotes));
    renderLotes();
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nuevo = {
        nombre: document.getElementById('nombre-lote').value.trim(),
        tipo: document.getElementById('tipo-residuo').value,
        peso: document.getElementById('peso').value,
        fecha: document.getElementById('fecha-inicio').value,
        notas: document.getElementById('notas').value.trim()
    };
    lotes.unshift(nuevo);
    localStorage.setItem('ecopulse_lotes', JSON.stringify(lotes));
    renderLotes();
    form.reset();
    // feedback visual
    lotesList.insertAdjacentHTML('beforebegin', '<div class="alert alert-success" id="tmp-ok"><i class="fas fa-check"></i> Lote registrado correctamente</div>');
    setTimeout(() => document.getElementById('tmp-ok')?.remove(), 2500);
});

// Inicializar fecha hoy
document.getElementById('fecha-inicio').valueAsDate = new Date();
renderLotes();

// ===== EcoGame =====
const residuos = [
    { name: 'Cáscara de Manzana', emoji: '🍎', desc: 'Resto de fruta fresca', compostable: true },
    { name: 'Cáscara de Plátano', emoji: '🍌', desc: 'Rica en potasio', compostable: true },
    { name: 'Restos de Café', emoji: '☕', desc: 'Posos de café molido', compostable: true },
    { name: 'Cáscara de Huevo', emoji: '🥚', desc: 'Aporta calcio', compostable: true },
    { name: 'Hojas Secas', emoji: '🍂', desc: 'Material marrón', compostable: true },
    { name: 'Cartón sin tinta', emoji: '📦', desc: 'Cartón corrugado', compostable: true },
    { name: 'Césped Cortado', emoji: '🌿', desc: 'Material verde fresco', compostable: true },
    { name: 'Restos de Verduras', emoji: '🥕', desc: 'Zanahoria, lechuga, etc.', compostable: true },
    { name: 'Servilleta de Papel', emoji: '🧻', desc: 'Sin químicos, sucia de comida', compostable: true },
    { name: 'Pan Duro', emoji: '🍞', desc: 'En pequeñas cantidades', compostable: true },
    { name: 'Botella Plástica', emoji: '🧴', desc: 'PET - plástico', compostable: false },
    { name: 'Bolsa Plástica', emoji: '🛍️', desc: 'Polietileno', compostable: false },
    { name: 'Vidrio Roto', emoji: '🍷', desc: 'Cristal / vidrio', compostable: false },
    { name: 'Lata de Aluminio', emoji: '🥫', desc: 'Metal', compostable: false },
    { name: 'Pañal Desechable', emoji: '🩹', desc: 'Contiene plásticos', compostable: false },
    { name: 'Carne Cruda', emoji: '🥩', desc: 'Atrae plagas, no recomendado', compostable: false },
    { name: 'Queso / Lácteos', emoji: '🧀', desc: 'Genera mal olor', compostable: false },
    { name: 'Aceite Usado', emoji: '🛢️', desc: 'Impermeabiliza el compost', compostable: false },
    { name: 'Colilla de Cigarro', emoji: '🚬', desc: 'Contiene tóxicos', compostable: false },
    { name: 'Pilas', emoji: '🔋', desc: 'Residuo peligroso', compostable: false },
];

let currentItem = null;
let score = parseInt(localStorage.getItem('ecogame_score') || '0');
let correct = parseInt(localStorage.getItem('ecogame_correct') || '0');
let total = parseInt(localStorage.getItem('ecogame_total') || '0');

const elEmoji = document.getElementById('game-item-emoji');
const elName = document.getElementById('game-item-name');
const elDesc = document.getElementById('game-item-desc');
const elScore = document.getElementById('game-score');
const elCorrect = document.getElementById('game-correct');
const elTotal = document.getElementById('game-total');
const elAccuracy = document.getElementById('game-accuracy');
const elFeedback = document.getElementById('game-feedback');
const elHistory = document.getElementById('game-history-list');

function updateStats() {
    elScore.textContent = score;
    elCorrect.textContent = correct;
    elTotal.textContent = total;
    elAccuracy.textContent = total === 0 ? '0%' : Math.round((correct/total)*100) + '%';
    localStorage.setItem('ecogame_score', score);
    localStorage.setItem('ecogame_correct', correct);
    localStorage.setItem('ecogame_total', total);
}

function nextItem() {
    currentItem = residuos[Math.floor(Math.random() * residuos.length)];
    elEmoji.textContent = currentItem.emoji;
    elName.textContent = currentItem.name;
    elDesc.textContent = currentItem.desc;
    elFeedback.textContent = '';
    elFeedback.className = 'game-feedback';
}

function handleAnswer(userSaysCompostable) {
    if (!currentItem) return;
    const isCorrect = userSaysCompostable === currentItem.compostable;
    total++;
    if (isCorrect) {
        correct++;
        score += 10;
        elFeedback.textContent = `¡Correcto! ${currentItem.name} ${currentItem.compostable ? 'SÍ' : 'NO'} es compostable. +10 pts`;
        elFeedback.className = 'game-feedback correct';
    } else {
        score = Math.max(0, score - 5);
        elFeedback.textContent = `Incorrecto. ${currentItem.name} ${currentItem.compostable ? 'SÍ' : 'NO'} es compostable. -5 pts`;
        elFeedback.className = 'game-feedback wrong';
    }
    updateStats();

    // historial
    const li = document.createElement('li');
    li.innerHTML = `<span>${currentItem.emoji} ${currentItem.name}</span><span style="color:${isCorrect?'#2E7D32':'#C62828'};font-weight:700">${isCorrect?'✓':'✗'} ${isCorrect?'+10':'-5'}</span>`;
    elHistory.prepend(li);

    setTimeout(nextItem, 1200);
}

document.getElementById('btn-compostable').addEventListener('click', () => handleAnswer(true));
document.getElementById('btn-no-compostable').addEventListener('click', () => handleAnswer(false));
document.getElementById('btn-reset-game').addEventListener('click', () => {
    score = 0; correct = 0; total = 0;
    elHistory.innerHTML = '';
    updateStats();
    nextItem();
    elFeedback.textContent = 'Juego reiniciado. ¡Sigue aprendiendo!';
    elFeedback.className = 'game-feedback correct';
    setTimeout(() => { elFeedback.textContent=''; elFeedback.className='game-feedback'; }, 1500);
});

// Atajos de teclado: 1 = compostable, 2 = no compostable
document.addEventListener('keydown', (e) => {
    if (!document.getElementById('tab-ecogame').classList.contains('active')) return;
    if (e.key === '1') handleAnswer(true);
    if (e.key === '2') handleAnswer(false);
});

updateStats();
nextItem();
console.log('EcoPulse app.js cargado - fetch cada 3s + EcoGame activo');
