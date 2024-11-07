class ScenarioGame {
    constructor(type, scenarios) {
        this.type = type;
        this.scenarios = scenarios[type];
        this.currentScenario = null;
        this.score = 0;
        this.questionCount = 0;
        this.maxQuestions = 5;
        
        this.container = document.querySelector(`#${type}AdosModal .scenario-container`);
        
        if (this.container) {
            this.init();
        } else {
            console.error(`Container not found for type: ${type}`);
        }
    }

    init() {
        this.container.querySelector('.points').textContent = this.score;
        this.container.querySelector('.next-scenario').addEventListener('click', () => this.handleNextScenario());
        this.loadNewScenario();
    }

    handleNextScenario() {
        if (this.questionCount >= this.maxQuestions) {
            this.showFinalScore();
        } else {
            this.loadNewScenario();
        }
    }

    showFinalScore() {
        const questionContainer = this.container.querySelector('.question-container');
        const actionsContainer = this.container.querySelector('.actions-container');
        const feedbackMessage = this.container.querySelector('.feedback-message');

        questionContainer.innerHTML = '';
        actionsContainer.innerHTML = '';
        feedbackMessage.innerHTML = `
            <div class="final-score">
                <h2>🎯 Fin du jeu !</h2>
                <p>Score final: ${this.score} points sur ${this.maxQuestions * 10} possibles</p>
                <button onclick="location.reload()">Rejouer</button>
            </div>
        `;
    }

    init() {
        this.container.querySelector('.points').textContent = this.score;
        this.container.querySelector('.next-scenario').addEventListener('click', () => this.loadNewScenario());
        this.loadNewScenario();
    }

    loadNewScenario() {
        const questionContainer = this.container.querySelector('.question-container');
        const actionsContainer = this.container.querySelector('.actions-container');
        const feedbackMessage = this.container.querySelector('.feedback-message');

        questionContainer.innerHTML = '';
        actionsContainer.innerHTML = '';
        feedbackMessage.innerHTML = '';

        this.currentScenario = this.scenarios[Math.floor(Math.random() * this.scenarios.length)];
        questionContainer.textContent = this.currentScenario.question;

        const shuffledActions = [...this.currentScenario.actions]
            .sort(() => Math.random() - 0.5);

        shuffledActions.forEach((action, index) => {
            const actionElement = document.createElement('div');
            actionElement.className = 'action-item';
            actionElement.draggable = true;
            actionElement.textContent = action.text;
            actionElement.dataset.correctOrder = action.order;
            actionElement.dataset.currentPosition = index + 1;

            actionElement.addEventListener('dragstart', this.handleDragStart.bind(this));
            actionElement.addEventListener('dragover', this.handleDragOver.bind(this));
            actionElement.addEventListener('drop', this.handleDrop.bind(this));
            actionElement.addEventListener('dragend', () => this.checkOrder());

            actionsContainer.appendChild(actionElement);
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.currentPosition);
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const fromPosition = e.dataTransfer.getData('text/plain');
        const toPosition = e.target.dataset.currentPosition;

        const items = this.container.querySelectorAll('.action-item');
        const fromElement = [...items].find(item => item.dataset.currentPosition === fromPosition);
        const toElement = e.target;

        const tempPosition = fromElement.dataset.currentPosition;
        fromElement.dataset.currentPosition = toElement.dataset.currentPosition;
        toElement.dataset.currentPosition = tempPosition;

        if (fromElement.parentNode === toElement.parentNode) {
            const parent = toElement.parentNode;
            const fromIndex = [...parent.children].indexOf(fromElement);
            const toIndex = [...parent.children].indexOf(toElement);

            if (fromIndex < toIndex) {
                toElement.parentNode.insertBefore(fromElement, toElement.nextSibling);
            } else {
                toElement.parentNode.insertBefore(fromElement, toElement);
            }
        }
    }

    checkOrder() {
        const items = [...this.container.querySelectorAll('.action-item')];
        const isCorrect = items.every((item, index) =>
            parseInt(item.dataset.correctOrder) === index + 1
        );

        const feedbackMessage = this.container.querySelector('.feedback-message');

        if (isCorrect) {
            this.score += 10;
            this.container.querySelector('.points').textContent = this.score;
            feedbackMessage.innerHTML = `
                <div class="success-message">
                    <h3>🎉 Bravo ! Réponse correcte !</h3>
                    <p>Tu as gagné 10 points !</p>
                </div>
            `;
        }
    }
}

const scenarios = {
    feu: [
        {
            question: "Tu découvres un départ de feu en forêt. Quelle est la séquence d'actions correcte ?",
            actions: [
                { order: 1, text: "Alerter les secours" },
                { order: 2, text: "Évaluer la direction du vent" },
                { order: 3, text: "S'éloigner perpendiculairement au vent" }
            ]
        },
        {
            question: "Un feu se déclare dans ton voisinage. Comment réagir ?",
            actions: [
                { order: 1, text: "Appeler le 18" },
                { order: 2, text: "Fermer portes et fenêtres" },
                { order: 3, text: "Se confiner et attendre les secours" }
            ]
        },
        {
            question: "Tu aperçois de la fumée dans une zone boisée. Que faire ?",
            actions: [
                { order: 1, text: "Noter précisément la localisation" },
                { order: 2, text: "Contacter les pompiers" },
                { order: 3, text: "Guider les secours à distance" }
            ]
        },
        {
            question: "Un feu électrique se déclare dans ta cuisine. Quelle est la séquence d'actions ?",
            actions: [
                { order: 1, text: "Couper le courant électrique" },
                { order: 2, text: "Utiliser un extincteur adapté" },
                { order: 3, text: "Aérer la pièce" }
            ]
        },
        {
            question: "Tu vois un feu de voiture sur un parking. Comment réagir ?",
            actions: [
                { order: 1, text: "Appeler les pompiers" },
                { order: 2, text: "Éloigner les personnes" },
                { order: 3, text: "Sécuriser la zone" }
            ]
        }
    ],
    inondation: [
        {
            question: "L'eau monte dans ton quartier. Comment agir ?",
            actions: [
                { order: 1, text: "Couper électricité et gaz" },
                { order: 2, text: "Monter aux étages supérieurs" },
                { order: 3, text: "Attendre les secours en hauteur" }
            ]
        },
        {
            question: "Une alerte inondation est émise. Quelles précautions prendre ?",
            actions: [
                { order: 1, text: "Surélever les objets importants" },
                { order: 2, text: "Préparer un kit d'urgence" },
                { order: 3, text: "Se tenir informé via la radio" }
            ]
        },
        {
            question: "Les routes commencent à être inondées. Que faire ?",
            actions: [
                { order: 1, text: "Éviter tout déplacement" },
                { order: 2, text: "Prévenir ses proches" },
                { order: 3, text: "Suivre les consignes officielles" }
            ]
        },
        {
            question: "Une crue éclair est annoncée. Quelles mesures prendre ?",
            actions: [
                { order: 1, text: "Rassembler documents importants" },
                { order: 2, text: "Préparer une évacuation" },
                { order: 3, text: "Stocker de l'eau potable" }
            ]
        },
        {
            question: "Tu es en voiture pendant une inondation. Que faire ?",
            actions: [
                { order: 1, text: "Ne pas traverser les zones inondées" },
                { order: 2, text: "Faire demi-tour" },
                { order: 3, text: "Chercher un point haut" }
            ]
        }
    ],
    seisme: [
        {
            question: "Une secousse sismique se produit. Comment réagir ?",
            actions: [
                { order: 1, text: "S'abriter sous une table solide" },
                { order: 2, text: "S'éloigner des fenêtres" },
                { order: 3, text: "Attendre la fin des secousses" }
            ]
        },
        {
            question: "Tu es dans un bâtiment pendant un séisme. Que faire ?",
            actions: [
                { order: 1, text: "Se protéger la tête" },
                { order: 2, text: "Se placer près d'un mur porteur" },
                { order: 3, text: "Ne pas utiliser l'ascenseur" }
            ]
        },
        {
            question: "Après un séisme, quelles actions entreprendre ?",
            actions: [
                { order: 1, text: "Vérifier l'état du bâtiment" },
                { order: 2, text: "Couper les réseaux" },
                { order: 3, text: "Écouter la radio" }
            ]
        },
        {
            question: "Tu es en extérieur lors d'un séisme. Comment réagir ?",
            actions: [
                { order: 1, text: "S'éloigner des bâtiments" },
                { order: 2, text: "Se mettre en terrain dégagé" },
                { order: 3, text: "Rester immobile" }
            ]
        },
        {
            question: "Des répliques sismiques se produisent. Que faire ?",
            actions: [
                { order: 1, text: "Rester vigilant" },
                { order: 2, text: "Éviter les zones endommagées" },
                { order: 3, text: "Suivre les instructions" }
            ]
        }
    ],
    tsunami: [
        {
            question: "Un fort séisme est ressenti près de la côte. Comment agir ?",
            actions: [
                { order: 1, text: "S'éloigner immédiatement du rivage" },
                { order: 2, text: "Gagner un point haut" },
                { order: 3, text: "Rester en hauteur minimum 3h" }
            ]
        },
        {
            question: "La mer se retire anormalement. Que faire ?",
            actions: [
                { order: 1, text: "Alerter les personnes autour" },
                { order: 2, text: "Évacuer rapidement la plage" },
                { order: 3, text: "Rejoindre un point d'altitude" }
            ]
        },
        {
            question: "Une alerte tsunami est déclenchée. Comment réagir ?",
            actions: [
                { order: 1, text: "S'éloigner des côtes" },
                { order: 2, text: "Monter en hauteur" },
                { order: 3, text: "Attendre les consignes officielles" }
            ]
        },
        {
            question: "Tu es en bateau lors d'une alerte tsunami. Comment agir ?",
            actions: [
                { order: 1, text: "Gagner le large" },
                { order: 2, text: "Maintenir contact radio" },
                { order: 3, text: "Attendre fin d'alerte" }
            ]
        },
        {
            question: "Après un tsunami, quelles précautions prendre ?",
            actions: [
                { order: 1, text: "Attendre autorisation retour" },
                { order: 2, text: "Vérifier qualité eau" },
                { order: 3, text: "Éviter zones inondées" }
            ]
        }
    ]
};
