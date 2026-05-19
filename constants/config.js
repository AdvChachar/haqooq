// IMPORTANT: The API key is loaded from .env (git-ignored) via app.config.js
// at build/dev-server time. NEVER hardcode a key in this file.
//
// For production EAS builds, use: eas secret:create --name GEMINI_API_KEY --value "your_key"
// app.config.js reads process.env.GEMINI_API_KEY and injects it here.

import Constants from 'expo-constants';

export const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey;

if (__DEV__ && !GEMINI_API_KEY) {
  console.warn(
    '[Haqooq] GEMINI_API_KEY not found. Create a .env file (see .env.example).'
  );
}
