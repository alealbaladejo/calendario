const calendarEl = document.getElementById("calendar");
const resumenSemana = document.getElementById("horas-semana");
const resumenMes = document.getElementById("horas-mes");

const turnosPorHora = {
    manana: 4,
    tarde: 4,
    ambos: 8
};

const hoy = new Date();
const year = hoy.getFullYear();
const diasMes = [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function guardarTurno(fecha, turno) {
    localStorage.setItem(fecha, turno);
    calcularResumen();
}

function cargarTurno(fecha) {
    return localStorage.getItem(fecha);
}

function crearDia(mes, dia) {
    const fecha = \`\${year}-\${String(mes+1).padStart(2,'0')}-\${String(dia).padStart(2,'0')}\`;
    const div = document.createElement("div");
    div.className = "day";
    div.innerHTML = \`
        <div class="day-header">\${dia}/\${mes+1}</div>
        <div class="turnos">
            <button onclick="guardarTurno('\${fecha}', 'manana')">Mañana</button>
            <button onclick="guardarTurno('\${fecha}', 'tarde')">Tarde</button>
            <button onclick="guardarTurno('\${fecha}', 'ambos')">Ambos</button>
        </div>
    \`;
    calendarEl.appendChild(div);
}

function generarCalendario() {
    for (let m = 0; m < 12; m++) {
        for (let d = 1; d <= diasMes[m]; d++) {
            crearDia(m, d);
        }
    }
}

function calcularResumen() {
    const hoy = new Date();
    const semanaActual = getSemanaDelAno(hoy);
    let horasSemana = 0;
    let horasMes = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const fecha = localStorage.key(i);
        const turno = localStorage.getItem(fecha);
        const fechaObj = new Date(fecha);
        if (fechaObj.getFullYear() !== year) continue;

        const semana = getSemanaDelAno(fechaObj);
        if (semana === semanaActual) horasSemana += turnosPorHora[turno] || 0;
        if (fechaObj.getMonth() === hoy.getMonth()) horasMes += turnosPorHora[turno] || 0;
    }

    resumenSemana.textContent = horasSemana;
    resumenMes.textContent = horasMes;
}

function getSemanaDelAno(d) {
    const fecha = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const diaNum = fecha.getUTCDay() || 7;
    fecha.setUTCDate(fecha.getUTCDate() + 4 - diaNum);
    const inicioAno = new Date(Date.UTC(fecha.getUTCFullYear(),0,1));
    return Math.ceil((((fecha - inicioAno) / 86400000) + 1)/7);
}

generarCalendario();
calcularResumen();