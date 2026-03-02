const preguntas = [
    {
        pregunta: "¿Quién fue José Jackson Jácamo Vanegas en el contexto de la insurrección sandinista de 1979?",
        opciones: ["Un político extranjero", "Un guardia somocista", "Un héroe sandinista caído en combate", "Presidente después de 1979"],
        respuestaCorrecta: 2,
        justificacion: "Fue combatiente del FSLN y murió en junio de 1979 durante la ofensiva final contra la dictadura. Su caída ocurrió semanas antes del triunfo del 19 de julio de 1979. Es recordado en efemérides sandinistas como héroe de la insurrección."
    },
    {
        pregunta: "¿En qué sector de Managua cayó?",
        opciones: ["Plaza de la República", "El Dorado (Colonia 10 de Junio)", "León Centro", "Barrio San Judas"],
        respuestaCorrecta: 1,
        justificacion: "Los registros históricos ubican su muerte en El Dorado, barrio oriental de Managua. En junio de 1979 esa zona fue escenario de combates urbanos intensos. Allí la resistencia popular enfrentó a la Guardia Nacional."
    },
    {
        pregunta: "¿En qué acontecimiento histórico participó?",
        opciones: ["Guerra civil de 1912", "Independencia de Centroamérica", "Revolución de 1948", "Insurrección popular contra la dictadura somocista"],
        respuestaCorrecta: 3,
        justificacion: "Formó parte de la insurrección de 1978-1979 contra Anastasio Somoza Debayle. Culminó con la huida de Somoza el 17 de julio de 1979."
    },
    {
        pregunta: "¿Por qué se le considera \"héroe\"?",
        opciones: ["Dio su vida por la liberación del pueblo", "Fue líder político posterior", "Participó en la economía", "Fue diplomático"],
        respuestaCorrecta: 0,
        justificacion: "En la memoria sandinista se denomina héroes a quienes murieron combatiendo la dictadura. Su sacrificio se vincula al triunfo revolucionario del 19 de julio de 1979."
    },
    {
        pregunta: "¿Qué organización lideró la lucha armada?",
        opciones: ["Ejército Popular Costarricense", "Partido Liberal", "Frente Sandinista de Liberación Nacional (FSLN)", "Ejército Nacional"],
        respuestaCorrecta: 2,
        justificacion: "El FSLN fue fundado en 1961 inspirado en Sandino. Dirigió la ofensiva final en ciudades como Managua y León en 1979."
    },
    {
        pregunta: "¿Qué efecto social tuvieron sus acciones?",
        opciones: ["Generaron aislamiento total", "Fortalecieron la lucha colectiva contra la represión", "Aumentaron el turismo", "Fueron solo culturales"],
        respuestaCorrecta: 1,
        justificacion: "En 1979 estudiantes, obreros y pobladores participaron en barricadas y huelgas. Estas acciones fortalecieron la resistencia contra la Guardia Nacional."
    },
    {
        pregunta: "¿En qué año triunfó la Revolución Popular Sandinista?",
        opciones: ["1979", "1974", "1984", "1990"],
        respuestaCorrecta: 0,
        justificacion: "El 17 de julio de 1979 Somoza huyó del país. El 19 de julio el FSLN entró triunfante a Managua."
    },
    {
        pregunta: "¿Cuál era un objetivo principal de la insurrección?",
        opciones: ["Expandir minería", "Establecer monarquía", "Reforzar la Guardia", "Erradicar la dictadura somocista"],
        respuestaCorrecta: 3,
        justificacion: "La familia Somoza gobernaba desde 1936. El régimen era señalado por represión y desigualdad. La insurrección buscaba justicia social."
    },
    {
        pregunta: "¿Por qué es importante estudiar su figura?",
        opciones: ["Para conocer economía agrícola", "Para entender la lucha armada y su impacto social", "Para estudiar partidos modernos", "Para analizar turismo"],
        respuestaCorrecta: 1,
        justificacion: "Miles de jóvenes participaron en la insurrección de 1979. Analizar estas figuras ayuda a comprender el impacto político y social posterior."
    },
    {
        pregunta: "¿Quiénes protagonizaron la resistencia en barrios orientales?",
        opciones: ["Fuerzas extranjeras", "Diplomáticos", "Guardia Nacional", "Combatientes sandinistas populares"],
        respuestaCorrecta: 3,
        justificacion: "En junio y julio de 1979 los barrios orientales de Managua fueron bastiones de resistencia. La población organizada apoyó al FSLN en combates urbanos."
    }
];

// Configuración y Variables de Estado
let preguntaActualIndex = 0;
let puntaje = 0;
let nombreUsuario = "";
let facultadUsuario = "";
let temporizador; 
let tiempoRestante = 10;

// Elementos del DOM
const pantallaInicio = document.getElementById('pantalla-inicio');
const pantallaQuiz = document.getElementById('pantalla-quiz');
const pantallaResultados = document.getElementById('pantalla-resultados');
const btnEmpezar = document.getElementById('btn-empezar');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnReiniciar = document.getElementById('btn-reiniciar');
const preguntaTexto = document.getElementById('pregunta-texto');
const opcionesContenedor = document.getElementById('opciones-contenedor');
const progresoTexto = document.getElementById('progreso');
const puntuacionTexto = document.getElementById('puntuacion-actual');
const barraLlenado = document.getElementById('barra-llenado');
const tiempoTexto = document.getElementById('tiempo-restante');
const justificacionContenedor = document.getElementById('justificacion-contenedor');
const resultadoTexto = document.getElementById('resultado-texto');
const justificacionTexto = document.getElementById('justificacion-texto');

// Listeners
btnEmpezar.addEventListener('click', iniciarQuiz);
btnSiguiente.addEventListener('click', siguientePregunta);
btnReiniciar.addEventListener('click', reiniciarQuiz);

// --- NUEVO: Función para pedir el Top 5 apenas se abre la web ---
async function cargarTablaAlInicio() {
    try {
        const URL_API = '/api/score';
        const res = await fetch(URL_API);
        const leaderboard = await res.json();

        const tablaBody = document.getElementById('leaderboard-body');
        if (tablaBody && leaderboard.length > 0) {
            tablaBody.innerHTML = leaderboard.map((j, i) => `
                <tr>
                    <td>${i === 0 ? '👑' : i + 1}</td>
                    <td>${j.nombre}</td>
                    <td>${j.facultad}</td>
                    <td>${j.puntos}</td>
                </tr>
            `).join('');
        } else if (tablaBody) {
            tablaBody.innerHTML = `<tr><td colspan="4">Aún no hay puntajes. ¡Sé el primero!</td></tr>`;
        }
    } catch (e) {
        console.error("Error al cargar la tabla de inicio:", e);
    }
}

// Hace que la tabla cargue sola al entrar a la página
window.addEventListener('DOMContentLoaded', cargarTablaAlInicio);


function iniciarQuiz() {
    nombreUsuario = document.getElementById('nombre').value.trim();
    facultadUsuario = document.getElementById('facultad').value;

    if (!nombreUsuario || !facultadUsuario) {
        alert("Por favor, ingresa tu nombre y selecciona tu facultad.");
        return;
    }

    pantallaInicio.classList.add('oculta');
    pantallaQuiz.classList.remove('oculta');
    cargarPregunta();
}

function iniciarTemporizador() {
    tiempoRestante = 10;
    actualizarRelojUI();
    
    clearInterval(temporizador);
    temporizador = setInterval(() => {
        tiempoRestante--;
        actualizarRelojUI();
        
        if (tiempoRestante <= 0) {
            clearInterval(temporizador);
            tiempoAgotado();
        }
    }, 1000);
}

function actualizarRelojUI() {
    tiempoTexto.innerText = `${tiempoRestante < 10 ? '0' : ''}${tiempoRestante}s`;
    tiempoTexto.style.color = tiempoRestante <= 3 ? "#ff0000" : "#d32f2f";
}

function tiempoAgotado() {
    const todosLosBotones = opcionesContenedor.querySelectorAll('.btn-opcion');
    const preguntaActual = preguntas[preguntaActualIndex];
    
    todosLosBotones.forEach(btn => btn.disabled = true);
    todosLosBotones[preguntaActual.respuestaCorrecta].classList.add('correcto');
    
    resultadoTexto.innerText = "¡Tiempo Agotado!";
    resultadoTexto.style.color = "#dc3545"; 
    justificacionTexto.innerText = preguntaActual.justificacion;
    justificacionContenedor.classList.remove('oculta');
}

function cargarPregunta() {
    justificacionContenedor.classList.add('oculta');
    opcionesContenedor.innerHTML = '';
    
    const preguntaActual = preguntas[preguntaActualIndex];
    preguntaTexto.innerText = preguntaActual.pregunta;
    progresoTexto.innerText = `Pregunta ${preguntaActualIndex + 1} de ${preguntas.length}`;
    puntuacionTexto.innerText = `Puntos: ${puntaje}`;
    barraLlenado.style.width = `${((preguntaActualIndex) / preguntas.length) * 100}%`;

    preguntaActual.opciones.forEach((opcion, index) => {
        const boton = document.createElement('button');
        boton.innerText = opcion;
        boton.classList.add('btn-opcion');
        boton.addEventListener('click', () => seleccionarRespuesta(boton, index, preguntaActual.respuestaCorrecta));
        opcionesContenedor.appendChild(boton);
    });

    iniciarTemporizador();
}

function seleccionarRespuesta(botonSeleccionado, indexElegido, indexCorrecto) {
    clearInterval(temporizador); 
    const todosLosBotones = opcionesContenedor.querySelectorAll('.btn-opcion');
    const preguntaActual = preguntas[preguntaActualIndex];

    todosLosBotones.forEach(btn => btn.disabled = true);

    if (indexElegido === indexCorrecto) {
        botonSeleccionado.classList.add('correcto'); 
        resultadoTexto.innerText = "¡Respuesta Correcta!";
        resultadoTexto.style.color = "#28a745"; 
        
        let puntosGanados = (tiempoRestante >= 8) ? 10 : (tiempoRestante + 2);
        if (puntosGanados < 1) puntosGanados = 1;

        puntaje += puntosGanados;
        puntuacionTexto.innerText = `Puntos: ${puntaje}`;
        
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
    } else {
        botonSeleccionado.classList.add('incorrecto'); 
        resultadoTexto.innerText = "Respuesta Incorrecta";
        resultadoTexto.style.color = "#dc3545"; 
        todosLosBotones[indexCorrecto].classList.add('correcto');
    }

    justificacionTexto.innerText = preguntaActual.justificacion;
    justificacionContenedor.classList.remove('oculta');
}

function siguientePregunta() {
    preguntaActualIndex++;
    if (preguntaActualIndex < preguntas.length) {
        cargarPregunta();
    } else {
        barraLlenado.style.width = "100%";
        setTimeout(mostrarResultados, 500); 
    }
}

async function mostrarResultados() {
    pantallaQuiz.classList.add('oculta');
    pantallaResultados.classList.remove('oculta');
    
    document.getElementById('mensaje-final').innerText = `¡Gracias por participar, ${nombreUsuario}!`;
    document.getElementById('puntuacion-final').innerText = `Puntaje Final: ${puntaje}`;
    
    // Confeti final
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    // Guarda el puntaje en la base de datos de forma silenciosa
    await guardarPuntajeSilencioso();
}

// --- ACTUALIZADO: Ahora solo envía los datos a MongoDB ---
async function guardarPuntajeSilencioso() {
    try {
        const URL_API = '/api/score'; 
        await fetch(URL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: nombreUsuario,
                facultad: facultadUsuario,
                puntos: puntaje
            })
        });
        console.log("Puntaje enviado a la base de datos exitosamente.");
    } catch (e) {
        console.error("Error al enviar el puntaje:", e);
    }
}

function reiniciarQuiz() {
    preguntaActualIndex = 0;
    puntaje = 0;
    pantallaResultados.classList.add('oculta');
    pantallaInicio.classList.remove('oculta');
    document.getElementById('nombre').value = '';
    document.getElementById('facultad').value = '';
    barraLlenado.style.width = "0%";
    
    // Al reiniciar, recargamos la tabla para que se vea el nuevo puntaje ingresado
    cargarTablaAlInicio();
}