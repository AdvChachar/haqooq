import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../constants/colors';
import {
  getLanguage,
  saveLanguage,
  clearAllChatHistories,
} from '../utils/storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState('ur');

  useEffect(() => {
    (async () => {
      const lang = await getLanguage();
      setLanguage(lang);
    })();
  }, []);

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
            await clearAllChatHistories();
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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

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
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <Text style={[styles.aboutTag, language === 'ur' && styles.rtl]}>
              {language === 'ur'
                ? 'ایڈووکیٹ اور اے آئی سے تقویت یافتہ'
                : 'Advocate & AI Powered'}
            </Text>
            <Text style={styles.aboutCreator}>Mr. Chachar (Advocate)</Text>
            <View style={styles.aboutDivider} />
            <Text style={[styles.aboutDesc, language === 'ur' && styles.rtl]}>
              {language === 'ur'
                ? 'پاکستان بھر کے شہریوں کے لیے مفت قانونی معلومات کی ایپ۔'
                : 'Free legal information app for citizens across Pakistan.'}
            </Text>
            <View style={styles.aboutDivider} />
            <Text style={styles.aboutDisclaimer}>
              {language === 'ur'
                ? 'یہ ایپ قانونی مشورہ نہیں دیتی — صرف عمومی قانونی معلومات فراہم کرتی ہے۔'
                : 'This app does not provide legal advice — general information only.'}
            </Text>
            <View style={styles.aboutDivider} />
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push('/privacy')}
            >
              <Text style={styles.linkIcon}>🔒</Text>
              <Text style={styles.linkText}>
                {language === 'ur' ? 'رازداری کی پالیسی' : 'Privacy Policy'}
              </Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkRow}
              onPress={() => router.push('/tos')}
            >
              <Text style={styles.linkIcon}>📜</Text>
              <Text style={styles.linkText}>
                {language === 'ur' ? 'شرائط استعمال' : 'Terms of Service'}
              </Text>
              <Text style={styles.linkArrow}>›</Text>
            </TouchableOpacity>
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
  rtl: { textAlign: 'right' },
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
    marginBottom: 2,
  },
  aboutTag: {
    fontSize: 12,
    color: COLORS.goldAccent,
    fontWeight: '600',
    marginBottom: 2,
  },
  aboutCreator: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryNavy,
    marginBottom: 4,
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
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    marginTop: 8,
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryNavy,
  },
  linkArrow: {
    fontSize: 20,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
