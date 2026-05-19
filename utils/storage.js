import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from '../constants/logger';

const MAX_HISTORY_MESSAGES = 200;

const KEYS = {
  LANGUAGE: 'haqooq_language',
  ONBOARDED: 'haqooq_onboarded',
};

export const SECTIONS = {
  FAMILY: 'family',
  CRIMINAL: 'criminal',
  PROPERTY: 'property',
  LABOR: 'labor',
  OTHER: 'other',
};

const getChatKey = (section) => `haqooq_chat_${section}`;

// --- Language Preference ---
export const saveLanguage = async (lang) => {
  try {
    await AsyncStorage.setItem(KEYS.LANGUAGE, lang);
    return true;
  } catch (e) {
    logError('saveLanguage', e);
    return false;
  }
};

export const getLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(KEYS.LANGUAGE);
    return lang || 'ur';
  } catch (e) {
    logError('getLanguage', e);
    return 'ur';
  }
};

// --- Chat History (per section) ---
export const saveChatHistory = async (messages, section = SECTIONS.OTHER) => {
  try {
    const trimmed = messages.length > MAX_HISTORY_MESSAGES
      ? messages.slice(-MAX_HISTORY_MESSAGES)
      : messages;
    const json = JSON.stringify(trimmed);
    await AsyncStorage.setItem(getChatKey(section), json);
    return true;
  } catch (e) {
    logError('saveChatHistory', e);
    return false;
  }
};

export const getChatHistory = async (section = SECTIONS.OTHER) => {
  try {
    const json = await AsyncStorage.getItem(getChatKey(section));
    return json ? JSON.parse(json) : [];
  } catch (e) {
    logError('getChatHistory', e);
    return [];
  }
};

export const clearChatHistory = async (section = SECTIONS.OTHER) => {
  try {
    await AsyncStorage.removeItem(getChatKey(section));
    return true;
  } catch (e) {
    logError('clearChatHistory', e);
    return false;
  }
};

export const clearAllChatHistories = async () => {
  try {
    const keys = Object.values(SECTIONS).map(getChatKey);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (e) {
    logError('clearAllChatHistories', e);
    return false;
  }
};

// --- Onboarding ---
export const setOnboarded = async () => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
    return true;
  } catch (e) {
    logError('setOnboarded', e);
    return false;
  }
};

export const getOnboarded = async () => {
  try {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDED);
    return val === 'true';
  } catch (e) {
    logError('getOnboarded', e);
    return false;
  }
};
