import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../constants/colors';
import {
  getApiKey,
  saveApiKey,
  deleteApiKey,
  getLanguage,
  saveLanguage,
  clearChatHistory,
} from '../utils/storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [language, setLanguage] = useState('ur');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // 'ok' | 'fail' | null

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const [key, lang] = await Promise.all([getApiKey(), getLanguage()]);
    if (key) {
      setSavedKey(key);
      setApiKey(key);
    }
    setLanguage(lang);
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert(
        language === 'ur' ? 'خالی فیلڈ' : 'Empty Field',
        language === 'ur'
          ? 'براہ کرم API Key درج کریں۔'
          : 'Please enter an API Key.'
      );
      return;
    }
    setSaving(true);
    const success = await saveApiKey(apiKey.trim());
    setSaving(false);
    if (success) {
      setSavedKey(apiKey.trim());
      setTestStatus(null);
      Alert.alert(
        language === 'ur' ? 'محفوظ ہو گئی' : 'Saved',
        language === 'ur'
          ? 'API Key کامیابی سے محفوظ ہو گئی۔'
          : 'API Key saved successfully.'
      );
    }
  };

  const handleDeleteKey = () => {
    Alert.alert(
      language === 'ur' ? 'API Key حذف کریں' : 'Delete API Key',
      language === 'ur'
        ? 'کیا آپ API Key حذف کرنا چاہتے ہیں؟'
        : 'Are you sure you want to delete the API Key?',
      [
        {
          text: language === 'ur' ? 'ہاں' : 'Yes',
          style: 'destructive',
          onPress: async () => {
            await deleteApiKey();
            setApiKey('');
            setSavedKey('');
            setTestStatus(null);
          },
        },
        { text: language === 'ur' ? 'نہیں' : 'No', style: 'cancel' },
      ]
    );
  };

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim();
    if (!keyToTest) return;
    setTesting(true);
    setTestStatus(null);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${keyToTest}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: 'Say OK' }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        }
      );
      setTestStatus(response.ok ? 'ok' : 'fail');
    } catch {
      setTestStatus('fail');
    } finally {
      setTesting(false);
    }
  };

  const handleLanguageChange = async (lang) => {
    setLanguage(lang);
    await saveLanguage(lang);
  };

  const handleClearHistory = () => {
    Alert.alert(
      language === 'ur' ? 'تاریخ صاف کریں' : 'Clear History',
      language === 'ur'
        ? 'تمام چیٹ تاریخ حذف کی جائے گی۔'
        : 'All chat history will be deleted.',
      [
        {
          text: language === 'ur' ? 'ہاں، حذف کریں' : 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            await clearChatHistory();
            Alert.alert(
              language === 'ur' ? 'صاف ہو گئی' : 'Cleared',
              language === 'ur'
                ? 'چیٹ تاریخ حذف ہو گئی۔'
                : 'Chat history cleared.'
            );
          },
        },
        {
          text: language === 'ur' ? 'منسوخ' : 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const maskedKey =
    savedKey.length > 12
      ? `${savedKey.substring(0, 8)}${'•'.repeat(savedKey.length - 12)}${savedKey.slice(-4)}`
      : savedKey;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'ur' ? '⚙️ سیٹنگز' : '⚙️ Settings'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* API Key Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Gemini API Key</Text>
          <Text style={[styles.sectionHint, language === 'ur' && styles.rtl]}>
            {language === 'ur'
              ? 'Google AI Studio سے مفت API Key حاصل کریں: aistudio.google.com'
              : 'Get a free API Key from Google AI Studio: aistudio.google.com'}
          </Text>

          {/* Key status badge */}
          {savedKey ? (
            <View style={styles.savedKeyRow}>
              <View style={styles.savedKeyBadge}>
                <Text style={styles.savedKeyIcon}>✅</Text>
                <Text style={styles.savedKeyText} numberOfLines={1}>
                  {showKey ? savedKey : maskedKey}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setShowKey((v) => !v)}>
                <Text style={styles.showHideBtn}>{showKey ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noKeyBadge}>
              <Text style={styles.noKeyText}>
                {language === 'ur' ? '❌ API Key موجود نہیں' : '❌ No API Key set'}
              </Text>
            </View>
          )}

          {/* Input */}
          <TextInput
            style={styles.keyInput}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder={
              language === 'ur'
                ? 'API Key یہاں پیسٹ کریں...'
                : 'Paste API Key here...'
            }
            placeholderTextColor={COLORS.textSecondary}
            secureTextEntry={!showKey}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Buttons */}
          <View style={styles.keyButtons}>
            <TouchableOpacity
              style={[styles.btn, styles.testBtn]}
              onPress={handleTestKey}
              disabled={testing || !apiKey.trim()}
            >
              {testing ? (
                <ActivityIndicator size="small" color={COLORS.primaryNavy} />
              ) : (
                <Text style={styles.testBtnText}>
                  {language === 'ur' ? '🧪 ٹیسٹ' : '🧪 Test'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.saveBtn]}
              onPress={handleSaveKey}
              disabled={saving || !apiKey.trim()}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>
                  {language === 'ur' ? '💾 محفوظ کریں' : '💾 Save'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Test result */}
          {testStatus === 'ok' && (
            <Text style={styles.testOk}>
              ✅{' '}
              {language === 'ur'
                ? 'API Key کام کر رہی ہے!'
                : 'API Key is working!'}
            </Text>
          )}
          {testStatus === 'fail' && (
            <Text style={styles.testFail}>
              ❌{' '}
              {language === 'ur'
                ? 'API Key غلط ہے یا نیٹ ورک کی خرابی ہے۔'
                : 'Invalid API Key or network error.'}
            </Text>
          )}

          {/* Delete */}
          {savedKey ? (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteKey}>
              <Text style={styles.deleteBtnText}>
                {language === 'ur' ? '🗑️ API Key حذف کریں' : '🗑️ Delete API Key'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {language === 'ur' ? 'زبان کا انتخاب' : 'Language Preference'}
          </Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langOption, language === 'ur' && styles.langOptionActive]}
              onPress={() => handleLanguageChange('ur')}
            >
              <Text style={styles.langEmoji}>🇵🇰</Text>
              <Text style={[styles.langText, language === 'ur' && styles.langTextActive]}>
                اردو
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langOption, language === 'en' && styles.langOptionActive]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={styles.langEmoji}>🇬🇧</Text>
              <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {language === 'ur' ? 'ڈیٹا' : 'Data'}
          </Text>
          <TouchableOpacity style={styles.dangerRow} onPress={handleClearHistory}>
            <Text style={styles.dangerIcon}>🗑️</Text>
            <View>
              <Text style={styles.dangerTitle}>
                {language === 'ur' ? 'چیٹ تاریخ حذف کریں' : 'Clear Chat History'}
              </Text>
              <Text style={styles.dangerDesc}>
                {language === 'ur'
                  ? 'تمام پیغامات مستقل حذف ہو جائیں گے'
                  : 'All messages will be permanently deleted'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            {language === 'ur' ? 'ایپ کے بارے میں' : 'About'}
          </Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutAppName}>⚖️ حقوق</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0 — SDK 54</Text>
            <Text style={[styles.aboutDesc, language === 'ur' && styles.rtl]}>
              {language === 'ur'
                ? 'بلوچستان کے شہریوں کے لیے مفت قانونی معلومات کی ایپ۔ Google Gemini AI سے تقویت یافتہ۔'
                : 'Free legal information app for citizens of Balochistan, powered by Google Gemini AI.'}
            </Text>
            <View style={styles.aboutDivider} />
            <Text style={styles.aboutDisclaimer}>
              {language === 'ur'
                ? 'یہ ایپ قانونی مشورہ نہیں دیتی — صرف عمومی قانونی معلومات فراہم کرتی ہے۔'
                : 'This app does not provide legal advice — general information only.'}
            </Text>
          </View>
        </View>

        <View style={{ height: insets.bottom + 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primaryNavy,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 36, height: 36, justifyContent: 'center' },
  backIcon: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  scrollContent: { padding: 16 },
  section: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  sectionHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 14,
    lineHeight: 19,
  },
  rtl: { textAlign: 'right' },
  savedKeyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  savedKeyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  savedKeyIcon: { fontSize: 16 },
  savedKeyText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
  },
  showHideBtn: { fontSize: 18, paddingLeft: 8 },
  noKeyBadge: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  noKeyText: { color: COLORS.error, fontSize: 13 },
  keyInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    marginBottom: 12,
  },
  keyButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  btn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  testBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primaryNavy,
  },
  testBtnText: {
    color: COLORS.primaryNavy,
    fontWeight: '700',
    fontSize: 14,
  },
  saveBtn: { backgroundColor: COLORS.primaryNavy },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  testOk: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  testFail: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  deleteBtn: {
    marginTop: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteBtnText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: '600',
  },
  langRow: { flexDirection: 'row', gap: 12 },
  langOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
  },
  langOptionActive: {
    borderColor: COLORS.primaryNavy,
    backgroundColor: 'rgba(27,58,92,0.06)',
  },
  langEmoji: { fontSize: 20 },
  langText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  langTextActive: { color: COLORS.primaryNavy },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  dangerIcon: { fontSize: 24 },
  dangerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error,
    marginBottom: 2,
  },
  dangerDesc: { fontSize: 12, color: COLORS.textSecondary },
  aboutCard: { alignItems: 'center' },
  aboutAppName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primaryNavy,
    marginBottom: 4,
  },
  aboutVersion: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  aboutDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  aboutDivider: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    width: '100%',
    marginVertical: 12,
  },
  aboutDisclaimer: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 17,
  },
});
