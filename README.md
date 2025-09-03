🚀 SpeakGenie - Real-Time AI Voice Tutor
An advanced, multilingual AI-powered tutor built for the SpeakGenie Internship Task.
https://github.com/Harshikashar/SpeakGenie-Internship--Task/blob/main/docs/HomeScreen.png

✨ Key Highlights & Achievements
🏆 Exceeded Expectations: Went beyond the initial task requirements by building a fully multilingual conversational engine, not just a simple translation playback feature.

🎨 Professional UI/UX: Designed a polished, mobile-first interface inspired by the official SpeakGenie branding to create a delightful and intuitive experience for children.

🧠 Smart Problem-Solving: Successfully navigated real-world API limitations by strategically pivoting from paid services to a robust, 100% free technology stack without compromising core functionality.

🌟 Core Features
This project is a comprehensive demo that brings SpeakGenie's mission to life.

🤖 AI Chatbot Mode

An open-ended conversational mode where users can have a free-flowing voice chat with the AI tutor, "Genie".

🎭 Interactive Roleplay Mode

Builds confidence and vocabulary through guided, real-world scenarios. Includes 5 diverse situations:

🏫 At School

🛍️ At the Store

🏠 At Home

👋 Meet a New Friend

🧘 Daily Yoga

🌐 Advanced Multilingual Engine

The user can select a language (English, Hindi, Marathi, etc.), and the AI will both understand and respond in that language, providing a truly native experience.

💡 Smart English Feedback System

When English is selected, the AI acts as a smart tutor, providing real-time, encouraging feedback and gentle corrections ("⭐ Smart Tips") on grammar and phrasing.

🛠️ Technology Stack
This project was built using a modern and scalable tech stack focused on reliability and cost-effectiveness.

Category

Technology / Service

Backend

Python, Flask

AI Brain

Google Gemini API (gemini-1.5-flash)

Frontend

HTML5, CSS3, JavaScript (ES6)

Voice Tech

Browser's native Web Speech API (STT & TTS)

🤔 Architectural Decisions & Problem-Solving
A key part of this project was adapting to real-world technical challenges.

The Challenge:
The initially suggested APIs (OpenAI and ElevenLabs) presented significant hurdles due to their free-tier limitations, including restrictive usage quotas and sudden account blocks ("unusual activity"). This made them unreliable for building a stable application.

The Solution:
Instead of being blocked, I made a strategic decision to pivot to a more robust and resilient technology stack.

For the AI Model: I switched to the Google Gemini API, which offers a much more generous free tier, ensuring the application remains stable and functional.

For Voice I/O: I integrated the browser's powerful and native Web Speech API. This masterstroke eliminated the need for external API keys for STT/TTS, removed all usage limits, and made the frontend faster and more self-sufficient.

This pivot demonstrates a key engineering skill: the ability to solve problems and deliver a successful project despite unforeseen technical constraints.

⚠️ Known Limitations
TTS for Regional Languages: The quality of Text-to-Speech for regional languages is dependent on the user's OS having the necessary voice packs installed. The application's framework is fully multilingual, but the voice quality is determined by the client's machine. This is a known limitation of the browser's free Web Speech API.

🚀 How to Run the Project
1. Backend Setup
# Navigate to the backend folder
cd backend

# Create a .env file and add your Google API key
echo "GOOGLE_API_KEY='your_google_api_key_here'" > .env

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py

The backend server will start on http://127.0.0.1:5000.

2. Frontend Setup
In VS Code, ensure you have the "Live Server" extension.

Open the frontend/index.html file.

Right-click and select "Open with Live Server".

The application will launch in your browser, ready to use!!
