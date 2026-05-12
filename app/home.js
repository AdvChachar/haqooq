import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import QuickCard from '../components/QuickCard';
import LanguageToggle from '../components/LanguageToggle';
import COLORS from '../constants/colors';
import QUICK_QUESTIONS from '../constants/quickQuestions';
import { getApiKey, getLanguage, saveLanguage } from '../utils/storage';

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    icon: '📋',
    titleEn: 'File FIR',
    titleUr: 'ایف آئی آر',
    descEn: 'Know your rights',
    descUr: 'اپنے حقوق جانیں',
  },
  {
    icon: '👩‍⚖️',
    titleEn: 'Family Law',
    titleUr: 'خاندانی قانون',
    descEn: 'Marriage & divorce',
    descUr: 'نکاح اور طلاق',
  },
  {
    icon: '🏛️',
    titleEn: 'Court Help',
    titleUr: 'عدالتی مدد',
    descEn: 'Procedures & rights',
    descUr: 'طریقہ کار',
  },
  {
    icon: '🪪',
    titleEn: 'NADRA',
    titleUr: 'نادرا',
    descEn: 'CNIC & documents',
    descUr: 'شناختی کارڈ',
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState('ur');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadPreferences();
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('صبح بخیر');
    else if (hour < 17) setGreeting('دوپہر بخیر');
    else setGreeting('شام بخیر');
  }, []);

  const loadPreferences = async () => {
    const [lang, key] = await Promise.all([getLanguage(), getApiKey()]);
    setLanguage(lang);
    setHasApiKey(!!key);
  };

  const handleLanguageToggle = async (lang) => {
    setLanguage(lang);
    await saveLanguage(lang);
  };

  const handleQuickQuestion = useCallback(
    (item) => {
      const question = language === 'ur' ? item.questionUr : item.questionEn;
      router.push({ pathname: '/chat', params: { initialQuestion: question } });
    },
    [language]
  );

  const handleNewChat = useCallback(() => {
    if (!hasApiKey) {
      Alert.alert(
        language === 'ur' ? 'API Key درکار ہے' : 'API Key Required',
        language === 'ur'
          ? 'براہ کرم پہلے سیٹنگز میں اپنی Gemini API Key درج کریں۔'
          : 'Please add your Gemini API Key in Settings first.',
        [
          {
            text: language === 'ur' ? 'سیٹنگز' : 'Settings',
            onPress: () => router.push('/settings'),
          },
          { text: language === 'ur' ? 'بعد میں' : 'Later', style: 'cancel' },
        ]
      );
      return;
    }
    router.push('/chat');
  }, [hasApiKey, language]);

  const renderQuickCard = useCallback(
    ({ item }) => (
      <QuickCard item={item} onPress={handleQuickQuestion} language={language} />
    ),
    [handleQuickQuestion, language]
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.headerTitle}>
            {language === 'ur' ? 'حقوق — قانونی مدد' : 'Haqooq Legal Aid'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <LanguageToggle language={language} onToggle={handleLanguageToggle} />
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/settings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>⚖️</Text>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>
                {language === 'ur' ? 'اپنے حقوق جانیں' : 'Know Your Rights'}
              </Text>
              <Text style={styles.heroSubtitle}>
                {language === 'ur'
                  ? 'پاکستانی قانون کے بارے میں آسان زبان میں مدد'
                  : 'Simple answers about Pakistani law'}
              </Text>
            </View>
          </View>
          {!hasApiKey && (
            <TouchableOpacity
              style={styles.apiKeyBanner}
              onPress={() => router.push('/settings')}
            >
              <Text style={styles.apiKeyBannerText}>
                {language === 'ur'
                  ? '⚠️ API Key درج کریں — سیٹنگز کھولیں'
                  : '⚠️ Add API Key to start — Open Settings'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Start Chat Button */}
        <TouchableOpacity
          style={styles.startChatBtn}
          onPress={handleNewChat}
          activeOpacity={0.85}
        >
          <Text style={styles.startChatIcon}>💬</Text>
          <View style={styles.startChatTextBlock}>
            <Text style={styles.startChatTitle}>
              {language === 'ur' ? 'نئی بات چیت شروع کریں' : 'Start New Chat'}
            </Text>
            <Text style={styles.startChatSubtitle}>
              {language === 'ur'
                ? 'کوئی بھی قانونی سوال پوچھیں'
                : 'Ask any legal question'}
            </Text>
          </View>
          <Text style={styles.startChatArrow}>›</Text>
        </TouchableOpacity>

        {/* Quick Questions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'عام سوالات' : 'Common Questions'}
          </Text>
        </View>

        <FlatList
          data={QUICK_QUESTIONS}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickList}
          renderItem={renderQuickCard}
          scrollEnabled
        />

        {/* Coverage Areas */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {language === 'ur' ? 'قانونی شعبے' : 'Legal Areas Covered'}
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <TouchableOpacity
              key={i}
              style={styles.featureCard}
              onPress={handleNewChat}
              activeOpacity={0.75}
            >
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={[styles.featureTitle, language === 'ur' && styles.urduText]}>
                {language === 'ur' ? f.titleUr : f.titleEn}
              </Text>
              <Text style={[styles.featureDesc, language === 'ur' && styles.urduText]}>
                {language === 'ur' ? f.descUr : f.descEn}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={[styles.disclaimerText, language === 'ur' && styles.urduText]}>
            {language === 'ur'
              ? '⚠️ یہ ایپ عمومی قانونی معلومات فراہم کرتی ہے۔ پیچیدہ معاملات کے لیے وکیل سے رابطہ کریں۔'
              : '⚠️ This app provides general legal information only. For complex matters, consult a qualified lawyer.'}
          </Text>
        </View>

        <View style={{ height: insets.bottom + 20 }} />
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 2,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 22 },
  scrollContent: { paddingTop: 16 },
  heroBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 16,
    padding: 20,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroEmoji: { fontSize: 40 },
  heroText: { flex: 1 },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 19,
  },
  apiKeyBanner: {
    marginTop: 14,
    backgroundColor: 'rgba(201,168,76,0.2)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.goldAccent,
  },
  apiKeyBannerText: {
    color: COLORS.goldAccent,
    fontSize: 13,
    textAlign: 'center',
  },
  startChatBtn: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: COLORS.goldAccent,
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 6,
  },
  startChatIcon: { fontSize: 28 },
  startChatTextBlock: { flex: 1 },
  startChatTitle: {
    color: COLORS.primaryNavy,
    fontSize: 16,
    fontWeight: '700',
  },
  startChatSubtitle: {
    color: 'rgba(27,58,92,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  startChatArrow: {
    color: COLORS.primaryNavy,
    fontSize: 24,
    fontWeight: '700',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  quickList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 24,
    gap: 8,
  },
  featureCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    width: (width - 40) / 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  featureIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  urduText: { textAlign: 'right' },
  disclaimer: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  disclaimerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
