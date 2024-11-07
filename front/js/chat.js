document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const stopButton = document.getElementById('stopButton');
    const typingIndicator = document.getElementById('typingIndicator');

    const MISTRAL_API_KEY = 'et1sfCl8jrFTJW8C4xwX6WHDf6nxR6XC';
    const API_URL = 'https://api.mistral.ai/v1/chat/completions';

    // Enhanced system message for better readability
    const systemMessage = `Tu es un assistant amical pour les jeunes de 6 à 15 ans.
    Règles de communication:
    - Utilise une police plus grande (balise <span class="big-text">)
    - Ajoute des emojis colorés au début de chaque message
    - Mets en gras les mots importants avec <strong>
    - Utilise des puces pour lister les conseils
    - Ajoute des couleurs pour les mots clés avec <span class="highlight">
    - Limite les réponses à 3 points maximum
    - Parle uniquement de la prévention des risques naturels
    - Utilise un ton encourageant et rassurant`;

    let conversation = [{
        role: 'system',
        content: systemMessage
    }];

    function formatAIResponse(text) {
        return `<span class="big-text">${text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        }</span>`;
    }

    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'ai-message';
        messageDiv.innerHTML = isUser ? content : formatAIResponse(content);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        userInput.value = '';
        typingIndicator.style.display = 'block';
        sendButton.style.display = 'none';
        stopButton.style.display = 'block';

        conversation.push({
            role: 'user',
            content: message
        });

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'mistral-tiny',
                    messages: conversation,
                    max_tokens: 1000,
                    temperature: 0.7
                })
            });

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            conversation.push({
                role: 'assistant',
                content: aiResponse
            });

            addMessage(aiResponse, false);
        } catch (error) {
            addMessage("Désolé, je ne peux pas répondre pour le moment! 😅", false);
        }

        typingIndicator.style.display = 'none';
        sendButton.style.display = 'block';
        stopButton.style.display = 'none';
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});