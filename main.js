let attempts = 10; // Intentos iniciales
let score = 0; // Puntuación del jugador
const guessHistory = []; // Historial de adivinanzas
let timer; // Temporizador
let timeLeft = 10; // Tiempo restante en segundos
let successfulAttempts = 0; // Intentos exitosos
let difficulty = "medio"; // Nivel de dificultad (por defecto: medio)

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setMessage(message) {
    document.getElementById("message").textContent = message;
}

function showImage(isCorrect) {
    const correctImage = document.getElementById("correct-image");
    const wrongImage = document.getElementById("wrong-image");
    correctImage.style.display = isCorrect ? "block" : "none";
    wrongImage.style.display = isCorrect ? "none" : "block";
}

function updateGuessHistory(guess, isCorrect) {
    guessHistory.push({ guess, isCorrect });
    renderGuessHistory();
}

function renderGuessHistory() {
    const guessHistoryElement = document.getElementById("guessHistory");
    guessHistoryElement.innerHTML = `<strong>Historial de Adivinanzas:</strong><br>`;
    guessHistory.forEach((item, index) => {
        guessHistoryElement.innerHTML += `Intento ${index + 1}: ${item.guess} (${item.isCorrect ? "Correcto" : "Incorrecto"})<br>`;
    });
}

function updateSuccessfulAttempts() {
    document.getElementById("successfulAttempts").textContent = `Intentos Exitosos: ${successfulAttempts}`;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById("timeLeft").textContent = `Tiempo restante: ${timeLeft}`;
        } else {
            attempts--;
            document.getElementById("attempts").textContent = `Intentos restantes: ${attempts}`;
            timeLeft = 10;
            document.getElementById("timeLeft").textContent = `Tiempo restante: ${timeLeft}`;
            const computerGuess = generateRandomNumber(1, 15);
            setMessage("Se agotó el tiempo. ¡Se redujo un intento!");
            updateGuessHistory(-1, false);
            showImage(false);
            document.getElementById("result").textContent = `La computadora eligió: ${computerGuess}`;
            if (attempts === 0) {
                endGame();
            }
        }
    }, 1000);
}

function checkGuess() {
    const guess = parseInt(prompt("Ingresa tu suposición (un número entre 1 y 15):"));
    const resultElement = document.getElementById("result");

    if (isNaN(guess) || guess < 1 || guess > 15) {
        setMessage("Ingresa un número válido entre 1 y 15.");
    } else {
        clearInterval(timer);
        timeLeft = 10;
        document.getElementById("timeLeft").textContent = `Tiempo restante: ${timeLeft}`;

        const computerGuess = generateRandomNumber(1, 15);

        if (guess === computerGuess) {
            score++;
            setMessage("¡Felicidades! Has adivinado el número.");
            showImage(true);
            successfulAttempts++;
        } else if (guess < computerGuess) {
            setMessage("El número es mayor. Intenta de nuevo.");
            showImage(false);
        } else {
            setMessage("El número es menor. Intenta de nuevo.");
            showImage(false);
        }

        resultElement.textContent = `La computadora eligió: ${computerGuess}`;

        updateGuessHistory(guess, guess === computerGuess);
        updateSuccessfulAttempts();

        if (attempts === 0) {
            endGame();
        } else {
            startTimer();
        }
    }

    document.getElementById("score").textContent = `Puntuación: ${score}`;
    document.getElementById("attempts").textContent = `Intentos restantes: ${attempts}`;
}

function endGame() {
    setMessage(`¡Agotaste tus ${score} intentos! El número de la computadora era ${generateRandomNumber(1, 15)}.`);
    document.getElementById("checkButton").disabled = true;
    clearInterval(timer);
}

function resetGame() {
    attempts = 10;
    score = 0;
    guessHistory.length = 0;
    successfulAttempts = 0;
    document.getElementById("guess").value = "";
    setMessage("");
    document.getElementById("result").textContent = "";
    document.getElementById("score").textContent = "Puntuación: 0";
    document.getElementById("attempts").textContent = `Intentos restantes: ${attempts}`;
    document.getElementById("checkButton").disabled = false;
    document.getElementById("correct-image").style.display = "none";
    document.getElementById("wrong-image").style.display = "none";
    renderGuessHistory();
    timeLeft = 10;
    document.getElementById("timeLeft").textContent = `Tiempo restante: ${timeLeft}`;
}

function getHint() {
    const computerGuess = generateRandomNumber(1, 15);
    const isEven = computerGuess % 2 === 0;
    const hintMessage = isEven ? "El número es par." : "El número es impar.";
    setMessage(hintMessage);
}

document.getElementById("checkButton").addEventListener("click", checkGuess);
document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("hintButton").addEventListener("click", getHint);

// Agregar evento para reiniciar el juego al cargar la página
window.addEventListener("load", resetGame);
