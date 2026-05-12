export const detectLanguage = (text) => {
  if (!text || typeof text !== 'string') return 'ur';
  const urduChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const totalChars = text.replace(/\s/g, '').length;
  if (totalChars === 0) return 'ur';
  return urduChars / totalChars > 0.2 ? 'ur' : 'en';
};

export const isUrdu = (text) => detectLanguage(text) === 'ur';
export const isEnglish = (text) => detectLanguage(text) === 'en';
export const getTextDirection = (lang) => (lang === 'ur' ? 'rtl' : 'ltr');
export const getFontSizeMultiplier = (lang) => (lang === 'ur' ? 1.1 : 1.0);
