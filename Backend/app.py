# backend/app.py - Final Code for Unified Deployment

import os
import google.generativeai as genai
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

# --- IMPORTANT CHANGE ---
# Tell Flask that our frontend files are in a folder named 'frontend'
app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)

# --- AI Model Configuration ---

# Configure the Google Gemini API with the key from the .env file
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    # Initialize the specific Gemini model we'll be using
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Google Gemini model initialized successfully.")
except Exception as e:
    print(f"Error initializing Google Gemini model: {e}")
    model = None

# A dictionary to map language codes to their full names for use in prompts
lang_map = { "en": "English", "hi": "Hindi", "mr": "Marathi", "gu": "Gujarati", "ta": "Tamil", "te": "Telugu", "bn": "Bengali"}

#--------------API ROUTES

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat_handler():

# Handle the browser's preflight CORS request before the actual POST
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
# Ensure the Gemini model was initialized correctly
    if not model:
        return jsonify({"error": "Model not initialized"}), 500

# --- Request Data Processing ---

    data = request.get_json()
    user_text = data.get('text')
    lang_code = data.get('lang', 'en-US').split('-')[0]
    language_name = lang_map.get(lang_code, "English")
    mode = data.get('mode', 'free-chat')
    scenario = data.get('scenario', '')

# Basic validation to ensure we received text from the frontend
    if not user_text:
        return jsonify({"error": "No text provided"}), 400

# --- Dynamic Prompt Engineering ---
    prompt = ""

# --- Prompt Engineering Logic ---

# The instructions we give to the AI change based on the selected language.
    if lang_code == 'en':

# If the language is English, the AI acts as a tutor providing feedback.

        if mode == 'roleplay':
            print(f"Received text for '{scenario}' roleplay in {language_name}: {user_text}")
            prompt = f"""
            You are an AI English tutor named Genie, acting out a roleplay scenario: '{scenario}'.
            The user just said: "{user_text}".

            First, provide a natural, in-character response to continue the conversation.
            Then, on a new line, if the user made a clear grammatical mistake, provide a "⭐ Smart Tip:" to gently correct them.
            Do not use the words "Act" or "Feedback" or any asterisks in your final response.
            """
        else: # Free-chat
            print(f"Received text for free-chat in {language_name}: {user_text}")
            prompt = f"""
            You are 'Genie', a friendly and encouraging AI English tutor.
            The user said: "{user_text}"

            First, provide a natural and friendly response.
            Then, on a new line, if the user made a grammatical mistake, provide a "⭐ Smart Tip:" to gently correct them.
            If the user's English was perfect, you can say "You said that perfectly! ✨" in the Smart Tip section.
            Do not use the words "Converse" or "Feedback" or any asterisks in your final response.
            """
    else:
        print(f"Received text for conversation in {language_name}: {user_text}")
        prompt = f"""
        You are a friendly and helpful conversational AI assistant named Genie.
        Your primary goal is to have a natural conversation with the user in their own language, which is {language_name}.
        You MUST respond fluently and naturally in {language_name}.
        The user just said: "{user_text}"
        """
# --- Generate AI Response ---

    try:
        response = model.generate_content(prompt)
        ai_text_response = response.text
        print(f"AI responded in {language_name}: {ai_text_response}")
        return jsonify({"text": ai_text_response})
    except Exception as e:

# This block handles errors, including potential safety blocks from the API.
        print(f"An error occurred during the conversation: {e}")
        try:

# Attempt to get specific feedback if the prompt was blocked.
            error_details = response.prompt_feedback
            print(f"Prompt Feedback: {error_details}")
            ai_text_response = f"I'm sorry, I can't respond to that due to safety reasons. (Reason: {error_details.block_reason.name})"
        except Exception:

# Fallback to a generic error message.
            ai_text_response = "I'm sorry, an error occurred and I can't respond right now."
        return jsonify({"text": ai_text_response})

# This allows the script to be run directly using "python app.py"
if __name__ == '__main__':
    app.run(debug=True, port=5000)