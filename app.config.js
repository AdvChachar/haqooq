const fs = require('fs');
const path = require('path');

// Load .env file manually so it's not tracked by git
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    geminiApiKey: process.env.GEMINI_API_KEY,
  },
});
