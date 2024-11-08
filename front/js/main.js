document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments pour les enfants
    const mainModalBtn = document.getElementById('openMainModal');
    const mainModal = document.getElementById('mainModal');
    const riskCards = document.querySelectorAll('.risk-card');

    // Sélection des éléments pour les ados
    const adosModalBtn = document.getElementById('openAdosModal');
    const adosModal = document.getElementById('adosModal');
    const riskCardsAdos = document.querySelectorAll('.risk-card-ados');

    // Gestion de la modale enfants
    mainModalBtn.addEventListener('click', () => {
        mainModal.style.display = 'block';
    });

    // Gestion de la modale ados
    adosModalBtn.addEventListener('click', () => {
        adosModal.style.display = 'block';
    });

    // Gestion des cartes de risques pour enfants
    riskCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            mainModal.style.display = 'none';
            targetModal.style.display = 'block';
        });
    });

    // Gestion des cartes de risques pour ados
    riskCardsAdos.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            adosModal.style.display = 'none';
            targetModal.style.display = 'block';
        });
    });

    // Fermeture des modales via les boutons de fermeture
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-container, .modal-container-ados');
            modal.style.display = 'none';
        });
    });

    // Fermeture des modales en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-container') ||
            e.target.classList.contains('modal-container-ados')) {
            e.target.style.display = 'none';
        }
    });

    // Gestion des touches clavier (Échap pour fermer)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal-container, .modal-container-ados');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });

    // Initialisation du jeu de mémoire
    initializeMemoryGame();
});

// Logique du jeu de mémoire
function initializeMemoryGame() {
    const memoryGames = document.querySelectorAll('.memory-game');

    memoryGames.forEach(game => {
        const cards = Array.from(game.querySelectorAll('.memory-card'));
        let hasFlippedCard = false;
        let lockBoard = false;
        let firstCard, secondCard;

        function flipCard() {
            if (lockBoard || this === firstCard) return;

            this.classList.add('flipped');

            if (!hasFlippedCard) {
                hasFlippedCard = true;
                firstCard = this;
                return;
            }

            secondCard = this;
            checkForMatch();
        }

        function checkForMatch() {
            const isMatch = firstCard.dataset.card === secondCard.dataset.card;
            isMatch ? disableCards() : unflipCards();
        }

        function disableCards() {
            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');

            // Vérifier si toutes les cartes sont matchées
            const allCards = Array.from(game.querySelectorAll('.memory-card'));
            const allMatched = allCards.every(card => card.classList.contains('matched'));

            if (allMatched) {
                // Afficher le message de félicitations
                const congratsMessage = document.getElementById('congratsMessage');
                congratsMessage.style.display = 'block';
            }

            resetBoard();
        }

        function unflipCards() {
            lockBoard = true;
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetBoard();
            }, 1500);
        }

        function resetBoard() {
            [hasFlippedCard, lockBoard] = [false, false];
            [firstCard, secondCard] = [null, null];
        }

        function shuffle() {
            cards.forEach(card => {
                const randomPos = Math.floor(Math.random() * cards.length);
                card.style.order = randomPos;
                card.classList.remove('flipped', 'matched');
            });
        }

        function initGame() {
            cards.forEach(card => {
                card.addEventListener('click', flipCard);
                card.classList.remove('flipped', 'matched');
            });
            shuffle();
        }

        // Initialisation du jeu lorsque la modale s'ouvre
        const modalTriggers = document.querySelectorAll('[data-modal]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                setTimeout(initGame, 300);
            });
        });

        // Configuration initiale
        initGame();
    });
}

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
        audio.play();
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
