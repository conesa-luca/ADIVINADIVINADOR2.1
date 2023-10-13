let intentos = 10; // Intentos iniciales
let puntaje = 0; // Puntuación del jugador
const historialSuposiciones = []; // Historial de suposiciones
let intentosExitosos = 0; // Suposiciones correctas
let dificultad = "medio"; // Nivel de dificultad (por defecto: medio)
let tiempoRestante = 10; // Tiempo restante en segundos
let temporizador; // Temporizador

function mostrarMensajeSweetAlert(mensaje) {
    Swal.fire({
        title: 'Mensaje',
        text: mensaje,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}

// Ejemplo de uso
mostrarMensajeSweetAlert("¡Hola!soy la computadora y te reto a que adivines el numero en el que estoy pensando,si lo adivinas 3 veces te doy un certificado que diga que me ganaste pero lo dudo muajajaja.                            APRETA OK Y LUEGO ELEGIR NUMERO PARA COMENZAR");

function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mostrarMensaje(mensaje) {
    document.getElementById("message").textContent = mensaje;
}

function mostrarImagen(esCorrecta) {
    const imagenCorrecta = document.getElementById("correct-image");
    const imagenIncorrecta = document.getElementById("wrong-image");
    imagenCorrecta.style.display = esCorrecta ? "block" : "none";
    imagenIncorrecta.style.display = esCorrecta ? "none" : "block";
}

function actualizarHistorialSuposiciones(suposicion, esCorrecta) {
    historialSuposiciones.push({ suposicion, esCorrecta });
    renderizarHistorialSuposiciones();
}

function renderizarHistorialSuposiciones() {
    const historialSuposicionesElemento = document.getElementById("guessHistory");
    historialSuposicionesElemento.innerHTML = `<strong>Historial de Suposiciones:</strong><br>`;
    historialSuposiciones.forEach((item, index) => {
        historialSuposicionesElemento.innerHTML += `Suposición ${index + 1}: ${item.suposicion} (${item.esCorrecta ? "Correcta" : "Incorrecta"})<br>`;
    });
}

function actualizarIntentosExitosos() {
    document.getElementById("successfulAttempts").textContent = `Suposiciones Correctas: ${intentosExitosos}`;
}

function iniciarTemporizador() {
    clearInterval(temporizador);
    temporizador = setInterval(() => {
        if (tiempoRestante > 0) {
            tiempoRestante--;
            document.getElementById("timeLeft").textContent = `Tiempo Restante: ${tiempoRestante}`;
        } else {
            intentos--;
            document.getElementById("attempts").textContent = `Intentos Restantes: ${intentos}`;
            tiempoRestante = 10;
            document.getElementById("timeLeft").textContent = `Tiempo Restante: ${tiempoRestante}`;
            const suposicionComputadora = generarNumeroAleatorio(1, 15);
            mostrarMensaje("Se ha agotado el tiempo. ¡Se ha reducido un intento!");
            actualizarHistorialSuposiciones(-1, false);
            mostrarImagen(false);
            document.getElementById("result").textContent = `La computadora eligió: ${suposicionComputadora}`;
            if (intentos === 0) {
                finalizarJuego();
            }
        }
    }, 1000);
}

function verificarSuposicion() {
    const suposicionTexto = prompt("Ingresa tu suposición (un número entre 1 y 15):");
    const suposicion = parseInt(suposicionTexto);
    const resultadoElemento = document.getElementById("result");

    if (isNaN(suposicion) || suposicion < 1 || suposicion > 15) {
        mostrarMensaje("Ingresa un número válido entre 1 y 15.");
    } else {
        clearInterval(temporizador);
        tiempoRestante = 10;
        document.getElementById("timeLeft").textContent = `Tiempo Restante: ${tiempoRestante}`;

        const suposicionComputadora = generarNumeroAleatorio(1, 15);

        if (suposicion === suposicionComputadora) {
            puntaje++;
            mostrarMensaje("¡Felicidades! Has adivinado el número.");
            mostrarImagen(true);
            intentosExitosos++;
        } else if (suposicion < suposicionComputadora) {
            mostrarMensaje("El número es mayor. Inténtalo de nuevo.");
            mostrarImagen(false);
        } else {
            mostrarMensaje("El número es menor. Inténtalo de nuevo.");
            mostrarImagen(false);
        }

        resultadoElemento.textContent = `La computadora eligió: ${suposicionComputadora}`;

        actualizarHistorialSuposiciones(suposicion, suposicion === suposicionComputadora);
        actualizarIntentosExitosos();

        intentos--;
        document.getElementById("score").textContent = `Puntuación: ${puntaje}`;
        document.getElementById("attempts").textContent = `Intentos Restantes: ${intentos}`;

        if (intentos === 0) {
            finalizarJuego();
        } else {
            iniciarTemporizador();
        }
    }
}

function finalizarJuego() {
    mostrarMensaje(`¡Has agotado tus ${puntaje} intentos! El número de la computadora era ${generarNumeroAleatorio(1, 15)}.`);
    document.getElementById("checkButton").disabled = true;
    clearInterval(temporizador);
}

function reiniciarJuego() {
    intentos = 10;
    puntaje = 0;
    historialSuposiciones.length = 0;
    intentosExitosos = 0;
    document.getElementById("guessInput").value = "";
    mostrarMensaje("");
    document.getElementById("result").textContent = "";
    document.getElementById("score").textContent = "Puntuación: 0";
    document.getElementById("attempts").textContent = `Intentos Restantes: ${intentos}`;
    document.getElementById("checkButton").disabled = false;
    renderizarHistorialSuposiciones();
    tiempoRestante = 10;
    document.getElementById("timeLeft").textContent = `Tiempo Restante: ${tiempoRestante}`;
}

function obtenerPista() {
    const suposicionComputadora = generarNumeroAleatorio(1, 15);
    const esPar = suposicionComputadora % 2 === 0;
    const mensajePista = esPar ? "El número es par." : "El número es impar.";
    mostrarMensaje(mensajePista);
}

document.getElementById("checkButton").addEventListener("click", verificarSuposicion);
document.getElementById("resetButton").addEventListener("click", reiniciarJuego);
document.getElementById("hintButton").addEventListener("click", obtenerPista);
document.getElementById("difficultySelect").addEventListener("change", function() {
    dificultad = document.getElementById("difficultySelect").value;
    reiniciarJuego();
});

reiniciarJuego();