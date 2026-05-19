import SYSTEM_PROMPT from '../constants/systemPrompt';
import { GEMINI_API_KEY } from '../constants/config';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const formatMessagesForGemini = (messages) => {
  return messages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
};

export const sendMessageToGemini = async (
  userMessage,
  conversationHistory = []
) => {
  if (!GEMINI_API_KEY) throw new Error('NO_API_KEY');

  const allMessages = [
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  const requestBody = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: formatMessagesForGemini(allMessages),
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  };

  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GEMINI_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 400) throw new Error('INVALID_REQUEST');
      if (status === 401 || status === 403) throw new Error('INVALID_API_KEY');
      if (status === 429) throw new Error('RATE_LIMIT');
      if (status >= 500) throw new Error('SERVER_ERROR');
      throw new Error(`API_ERROR_${status}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0];
    if (!candidate) throw new Error('NO_RESPONSE');
    if (candidate.finishReason === 'SAFETY') throw new Error('SAFETY_BLOCK');

    const text = candidate?.content?.parts?.[0]?.text;
    if (!text) throw new Error('EMPTY_RESPONSE');

    return text;
  } catch (error) {
    const knownErrors = [
      'NO_API_KEY',
      'INVALID_REQUEST',
      'INVALID_API_KEY',
      'RATE_LIMIT',
      'SERVER_ERROR',
      'NO_RESPONSE',
      'SAFETY_BLOCK',
      'EMPTY_RESPONSE',
    ];
    if (knownErrors.includes(error.message)) throw error;
    if (error.name === 'TypeError') throw new Error('NETWORK_ERROR');
    throw new Error('UNKNOWN_ERROR');
  }
};

export const getErrorMessage = (errorCode, language = 'ur') => {
  const errors = {
    NO_API_KEY: {
      en: 'Service is temporarily unavailable. Please try again later.',
      ur: 'سروس عارضی طور پر دستیاب نہیں ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔',
    },
    INVALID_API_KEY: {
      en: 'Service configuration error. Please contact support.',
      ur: 'سروس کنفیگریشن میں خرابی۔ براہ کرم سپورٹ سے رابطہ کریں۔',
    },
    RATE_LIMIT: {
      en: 'Too many users right now. The app has reached its rate limit. Please wait a minute and try again.',
      ur: 'اس وقت بہت زیادہ صارفین ہیں۔ ایپ کی حد مکمل ہو گئی ہے۔ براہ کرم ایک منٹ انتظار کریں اور دوبارہ کوشش کریں۔',
    },
    NETWORK_ERROR: {
      en: 'No internet connection. Please check your network and try again.',
      ur: 'انٹرنیٹ کنیکشن نہیں ہے۔ اپنا نیٹ ورک چیک کریں۔',
    },
    SAFETY_BLOCK: {
      en: 'This message could not be processed due to safety filters.',
      ur: 'حفاظتی فلٹر کی وجہ سے یہ پیغام پروسیس نہیں ہو سکا۔',
    },
    SERVER_ERROR: {
      en: 'Server error. Please try again in a few minutes.',
      ur: 'سرور میں خرابی ہے۔ چند منٹ بعد دوبارہ کوشش کریں۔',
    },
    UNKNOWN_ERROR: {
      en: 'Something went wrong. Please try again.',
      ur: 'کچھ غلط ہو گیا۔ دوبارہ کوشش کریں۔',
    },
  };
  const msg = errors[errorCode] || errors.UNKNOWN_ERROR;
  return language === 'ur' ? msg.ur : msg.en;
};
