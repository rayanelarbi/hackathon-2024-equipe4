
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
