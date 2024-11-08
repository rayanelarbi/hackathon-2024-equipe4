function checkAnswers(quizId) {
    // Define correct answers for each quiz
    const answers = {
        "fire": {
            "q1_fire": "B",
            "q2_fire": "C",
            "q3_fire": "C"
        },
        "flood": {
            "q1_flood": "B",
            "q2_flood": "B",
            "q3_flood": "B"
        },
        "earthquake": {
            "q1_earthquake": "B",
            "q2_earthquake": "B",
            "q3_earthquake": "B"
        },
        "tsunami": {
            "q1_tsunami": "B",
            "q2_tsunami": "B",
            "q3_tsunami": "A"
        },
        "fireado": {
            "q1_fireado": "A",
            "q2_fireado": "A",
            "q3_fireado": "A"
        },
        "floodado": {
            "q1_floodado": "A",
            "q2_floodado": "B",
            "q3_floodado": "A"
        },
        "earthquakeado": {
            "q1_earthquakeado": "B",
            "q2_earthquakeado": "B",
            "q3_earthquakeado": "A"
        },
        "tsunamiado": {
            "q1_tsunamiado": "A",
            "q2_tsunamiado": "A",
            "q3_tsunamiado": "B"
        }
    };

    // Récupérer les réponses correctes pour le quiz sélectionné
    let correctAnswers = answers[quizId];
    let score = 0;
    let totalQuestions = Object.keys(correctAnswers).length;

    // Vérifier les réponses de l'utilisateur
    for (let question in correctAnswers) {
        let radios = document.getElementsByName(question);
        for (let radio of radios) {
            if (radio.checked && radio.value === correctAnswers[question]) {
                score++;
            }
        }
    }

    // Définir l'emoji en fonction du score
    let emoji = score === totalQuestions ? "✅" : "😞";

    // Afficher le résultat
    let resultMessage = `Vous avez répondu correctement à ${score} sur ${totalQuestions} questions. ${emoji}`;
    document.getElementById(`result_${quizId}`).innerText = resultMessage;

    // Lancer l'animation des confettis si toutes les réponses sont correctes
    if (score === totalQuestions) {
        launchConfetti();
        playConfettiSound();
    }
}

// Fonction pour créer et lancer des confettis en continu pendant 5 secondes
function launchConfetti() {
    const duration = 5000; // Durée de l'effet (5 secondes)
    const interval = 100;  // Intervalle entre la création des confettis
    const endTime = Date.now() + duration;

    const confettiInterval = setInterval(() => {
        if (Date.now() > endTime) {
            clearInterval(confettiInterval);
        } else {
            createConfetti();
        }
    }, interval);
}

// Fonction pour jouer le son des confettis
function playConfettiSound() {
    const audio = document.getElementById("confetti-sound");
    if (audio) {
        audio.currentTime = 0; // Recommencer le son à partir du début
        audio.play().catch(error => {
            console.error("Erreur lors de la lecture du son :", error);
        });
    } else {
        console.error("L'élément audio n'a pas été trouvé.");
    }
}


// Fonction pour créer un confetti unique
function createConfetti() {
    let confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.backgroundColor = getRandomColor();
    document.body.appendChild(confetti);

    // Retirer les confettis après 3 secondes pour éviter l'encombrement
    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

// Fonction pour obtenir une couleur aléatoire
function getRandomColor() {
    const colors = ["#ff0", "#0f0", "#00f", "#f0f", "#f00", "#0ff"];
    return colors[Math.floor(Math.random() * colors.length)];
}