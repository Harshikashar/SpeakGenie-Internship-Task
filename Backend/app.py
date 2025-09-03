import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# --- DEPLOYMENT FIX ---
# A simpler CORS setup is often more reliable in production environments like Render.
# This will allow requests from any origin (like your Vercel frontend).
CORS(app)

try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Google Gemini model initialized successfully.")
except Exception as e:
    print(f"Error initializing Google Gemini model: {e}")
    model = None

lang_map = { "en": "English", "hi": "Hindi", "mr": "Marathi", "gu": "Gujarati", "ta": "Tamil", "te": "Telugu", "bn": "Bengali" }

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat_handler():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
        
    if not model:
        return jsonify({"error": "Model not initialized"}), 500

    data = request.get_json()
    user_text = data.get('text')
    lang_code = data.get('lang', 'en-US').split('-')[0]
    language_name = lang_map.get(lang_code, "English")
    mode = data.get('mode', 'free-chat')
    scenario = data.get('scenario', '')

    if not user_text:
        return jsonify({"error": "No text provided"}), 400

    prompt = ""
    if lang_code == 'en':
        if mode == 'roleplay':
            prompt = f"""
            You are an AI English tutor named Genie, acting out a roleplay scenario: '{scenario}'.
            The user just said: "{user_text}".
            First, provide a natural, in-character response. Then, on a new line, if the user made a clear grammatical mistake, provide a "⭐ Smart Tip:" to gently correct them.
            Do not use "Act" or "Feedback" or any asterisks.
            """
        else:
            prompt = f"""
            You are 'Genie', a friendly AI English tutor. The user said: "{user_text}"
            First, provide a natural response. Then, on a new line, if the user made a mistake, provide a "⭐ Smart Tip:" to gently correct them. If their English was perfect, you can say "You said that perfectly! ✨" in the tip section.
            Do not use "Converse" or "Feedback" or any asterisks.
            """
    else:
        prompt = f"""
        You are a friendly conversational AI assistant named Genie. You are having a conversation in {language_name}.
        You MUST respond fluently in {language_name}.
        The user said: "{user_text}"
        """

    try:
        response = model.generate_content(prompt)
        ai_text_response = response.text
        return jsonify({"text": ai_text_response})
    except Exception as e:
        print(f"An error occurred: {e}")
        ai_text_response = "I'm sorry, an error occurred and I can't respond right now."
        return jsonify({"text": ai_text_response})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

