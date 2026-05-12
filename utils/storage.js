import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  API_KEY: 'haqooq_gemini_api_key',
  LANGUAGE: 'haqooq_language',
  CHAT_HISTORY: 'haqooq_chat_history',
  ONBOARDED: 'haqooq_onboarded',
};

// --- API Key ---
export const saveApiKey = async (key) => {
  try {
    await AsyncStorage.setItem(KEYS.API_KEY, key.trim());
    return true;
  } catch (e) {
    console.error('saveApiKey error:', e);
    return false;
  }
};

export const getApiKey = async () => {
  try {
    const key = await AsyncStorage.getItem(KEYS.API_KEY);
    return key || null;
  } catch (e) {
    console.error('getApiKey error:', e);
    return null;
  }
};

export const deleteApiKey = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.API_KEY);
    return true;
  } catch (e) {
    console.error('deleteApiKey error:', e);
    return false;
  }
};

// --- Language Preference ---
export const saveLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
    return true;
  } catch (e) {
    console.error('saveLanguage error:', e);
    return false;
  }
};

export const getLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return lang || 'ur';
  } catch (e) {
    console.error('getLanguage error:', e);
    return 'ur';
  }
};

// --- Chat History ---
export const saveChatHistory = async (messages) => {
  try {
    const json = JSON.stringify(messages);
    await AsyncStorage.setItem(KEYS.CHAT_HISTORY, json);
    return true;
  } catch (e) {
    console.error('saveChatHistory error:', e);
    return false;
  }
};

export const getChatHistory = async () => {
  try {
    const json = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('getChatHistory error:', e);
    return [];
  }
};

export const clearChatHistory = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.CHAT_HISTORY);
    return true;
  } catch (e) {
    console.error('clearChatHistory error:', e);
    return false;
  }
};

// --- Onboarding ---
export const setOnboarded = async () => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
    return true;
  } catch (e) {
    return false;
  }
};

export const getOnboarded = async () => {
  try {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDED);
    return val === 'true';
  } catch (e) {
    return false;
  }
};
