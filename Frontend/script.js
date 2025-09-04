document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const goToChatbotBtn = document.getElementById('goToChatbotBtn');
    const goToRoleplayBtn = document.getElementById('goToRoleplayBtn');
    const backBtns = document.querySelectorAll('.back-btn');
    const chatHeader = document.getElementById('chat-header');
    const chatContainer = document.getElementById('chat-container');
    const recordButton = document.getElementById('recordButton');
    const languageSelect = document.getElementById('language-select');
    const roleplayCards = document.querySelectorAll('.roleplay-card');

    // --- SCREEN MANAGEMENT LOGIC ---
    function showScreen(screenId) {
        screens.forEach(screen => screen.classList.remove('active'));
        const activeScreen = document.getElementById(screenId);
        if (activeScreen) activeScreen.classList.add('active');
    }

    goToChatbotBtn.addEventListener('click', () => {
        currentMode = 'free-chat';
        chatHeader.innerText = "AI Chatbot";
        chatContainer.innerHTML = '';
        addMessageToChat('Hello! You can ask me any questions.', 'ai');
        showScreen('chat-screen');
    });

    goToRoleplayBtn.addEventListener('click', () => {
        showScreen('roleplay-screen');
    });

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            speechSynthesis.cancel();
            showScreen('home-screen');
        });
    });

    // --- CORE CHATBOT LOGIC ---
    let isRecording = false;
    let currentLang = languageSelect.value;
    let currentMode = 'free-chat';
    let currentScenario = '';

    let initialMessages = {
        "At School": { "en-US": "Good morning! I am your teacher. What's your name?", "hi-IN": "नमस्ते! मैं तुम्हारी टीचर हूँ। तुम्हारा नाम क्या है?" },
        "At the Store": { "en-US": "Welcome to my store! What would you like to buy today?", "hi-IN": "मेरी दुकान में आपका स्वागत है! आज आप क्या खरीदना चाहेंगे?" },
        "At Home": { "en-US": "Hello! I am your parent. Did you have a good day at school?", "hi-IN": "नमस्ते! मैं तुम्हारे माता-पिता हूँ। क्या स्कूल में तुम्हारा दिन अच्छा था?" },
        "Meet a new friend": { "en-US": "Hi there! I'm new here. My name is Genie. What's your name?", "hi-IN": "नमस्ते! मैं यहाँ नया हूँ। मेरा नाम जिनी है। आपका नाम क्या है?" },
        "Daily yoga": { "en-US": "Welcome to our calm yoga session. Let's begin with a deep breath.", "hi-IN": "हमारे शांत योग सत्र में आपका स्वागत है। चलिए एक गहरी साँस से शुरुआत करते हैं।" }
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    function setupRecognition() {
        if (SpeechRecognition) {
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = currentLang;
            recognition.interimResults = false;
            recognition.onresult = (event) => {
                const userText = event.results[0][0].transcript;
                addMessageToChat(userText, 'user');
                getAIResponse(userText);
            };
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                addMessageToChat(`Error: ${event.error}`, 'ai');
            };
            recognition.onend = () => {
                isRecording = false;
                recordButton.classList.remove('recording');
            };
        } else {
            addMessageToChat("Sorry, your browser doesn't support Speech Recognition.", 'ai');
            recordButton.disabled = true;
        }
    }

    // --- MIC BUTTON CLICK HANDLER ---
    recordButton.addEventListener('click', () => {
        if (!isRecording) {
            // 🔑 Unlock voice on first user click
            const unlock = new SpeechSynthesisUtterance("Voice enabled");
            speechSynthesis.speak(unlock);

            recognition?.start();
            isRecording = true;
            recordButton.classList.add('recording');
        } else {
            recognition?.stop();
        }
    });

    languageSelect.addEventListener('change', () => {
        currentLang = languageSelect.value;
        setupRecognition();
    });

    roleplayCards.forEach(card => {
        card.addEventListener('click', () => {
            currentMode = 'roleplay';
            currentScenario = card.getAttribute('data-scenario');
            chatHeader.innerText = currentScenario;
            chatContainer.innerHTML = '';
            
            let langKey = currentLang.startsWith('hi') ? 'hi-IN' : 'en-US';
            const firstMessage = initialMessages[currentScenario][langKey] || initialMessages[currentScenario]['en-US'];
            
            addMessageToChat(firstMessage, 'ai');
            speak(firstMessage, currentLang);
            showScreen('chat-screen');
        });
    });

    async function getAIResponse(userText) {
        const bodyData = { text: userText, lang: currentLang, mode: currentMode, scenario: currentScenario };
        try {
            const response = await fetch('https://speakgenie-internship-task-3.onrender.com/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData),
            });
            if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
            const data = await response.json();
            
            addMessageToChat(data.text + ' ' + getRandomEmoji(), 'ai');
            speak(data.text, currentLang);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            addMessageToChat("Oops, an error occurred.", 'ai');
        }
    }

    function addMessageToChat(text, sender) {
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', `${sender}-bubble`);

        if (sender === 'ai') {
            const avatarDiv = document.createElement('div');
            avatarDiv.classList.add('bubble-avatar');
            const avatarImg = document.createElement('img');
            avatarImg.src = 'genie_avatar.png';
            avatarImg.alt = 'Genie';
            avatarDiv.appendChild(avatarImg);
            bubble.appendChild(avatarDiv);

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('bubble-content');
            contentDiv.innerText = text;
            bubble.appendChild(contentDiv);
        } else {
            bubble.innerText = text;
        }
        
        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // --- UPDATED SPEAK FUNCTION ---
    function speak(text, lang) {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }

        const voices = speechSynthesis.getVoices();
        const selectedVoice = voices.find(v => v.lang === lang);

        if (!selectedVoice) {
            console.warn(`No voice available for ${lang}, showing text only.`);
            return; // ❌ skip speaking if no voice
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;

        utterance.volume = 1;
        utterance.rate = 1;
        utterance.pitch = 1;

        speechSynthesis.speak(utterance);
    }

    // Debug: see which voices browser supports
    speechSynthesis.onvoiceschanged = () => {
        console.log("Voices available:", speechSynthesis.getVoices());
    };

    function getRandomEmoji() {
        const emojis = ['😊', '🌟', '👍', '💡', '💬', '✨', '😃'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    setupRecognition();
    showScreen('home-screen');
});
