🚀 SpeakGenie - Real-Time AI Voice Tutor 🚀
An advanced, multilingual AI-powered tutor built for the SpeakGenie Internship Task.
![Final App Interface]
https://github.com/Harshikashar/SpeakGenie-Internship--Task/blob/main/docs/HomeScreen.png

✨ Key Highlights & Achievements 🏆
Exceeded Expectations: Went beyond the initial task requirements by building a fully multilingual conversational engine, not just a simple translation playback feature.

Professional UI/UX: Designed a polished, mobile-first interface inspired by the official SpeakGenie branding to create a delightful and intuitive experience for children.

Smart Problem-Solving: Successfully navigated real-world API limitations by strategically pivoting from paid services to a robust, 100% free technology stack without compromising core functionality.

🌟 Core Features
This project is a comprehensive demo that brings SpeakGenie's mission to life.

🤖 AI Chatbot Mode: An open-ended conversational mode where users can have a free-flowing voice chat with the AI tutor, "Genie."

🎭 Interactive Roleplay Mode: Builds confidence and vocabulary through guided, real-world scenarios. Includes 5 diverse situations:

At School 🏫

At the Store 🛍️

At Home 🏠

Meet a New Friend 👋

Daily Yoga 🧘

🌐 Advanced Multilingual Engine: The tutor can dynamically listen and respond in multiple languages (English, Hindi, Marathi, etc.).

💡 Smart English Feedback System: When conversing in English, the AI provides real-time, encouraging feedback and gentle corrections ("⭐ Smart Tips") on grammar and phrasing.

🛠️ Technology Stack
Category

Technology / Service

Backend

Python, Flask

AI Model

Google Gemini API (gemini-1.5-flash)

Frontend

HTML5, CSS3, JavaScript (ES6)

Speech-to-Text

Browser's native Web Speech API (Recognition)

Text-to-Speech

Browser's native Web Speech API (Synthesis)

🧠 Architectural Decisions & Problem-Solving
During development, I initially planned to use the suggested OpenAI and ElevenLabs APIs. However, I encountered free-tier quota limits and account blocking issues. To overcome these real-world constraints, I successfully pivoted to a more robust and 100% free technology stack using Google's Gemini API and the browser's native Web Speech APIs. This strategic decision made the application more resilient and cost-effective while demonstrating strong problem-solving skills.

⚠️ Known Limitations
TTS for Regional Languages: The Text-to-Speech (TTS) functionality for regional languages (like Marathi, Gujarati, etc.) is dependent on the user's operating system having the necessary voice packs installed. The application's framework is fully multilingual and will work for any language with a pre-installed voice pack on the user's machine, as demonstrated with English and Hindi. This is a limitation of the browser's free Web Speech API, and a cloud-based TTS service would be the next step for universal support.

▶️ How to Run the Project
1. Backend Setup
# Navigate to the backend folder
cd backend

# Create a .env file and add your GOOGLE_API_KEY
echo "GOOGLE_API_KEY='your_google_api_key_here'" > .env

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py

2. Frontend Setup
Ensure you have the "Live Server" extension installed in VS Code.

Open the frontend/index.html file.

Right-click and select "Open with Live Server".