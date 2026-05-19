import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../constants/colors';
import { getLanguage } from '../utils/storage';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const [language, setLanguage] = useState('ur');

  useEffect(() => {
    (async () => {
      const lang = await getLanguage();
      setLanguage(lang);
    })();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'ur' ? 'رازداری کی پالیسی' : 'Privacy Policy'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {language === 'ur' ? (
          <>
            <Text style={styles.lastUpdated}>آخری اپ ڈیٹ: مئی 2026</Text>

            <Text style={styles.heading}>1. تعارف</Text>
            <Text style={styles.paragraph}>
              حقوق ایپ ("ہم"، "ہماری") آپ کی رازداری کے تحفظ کے لیے پرعزم ہے۔
              یہ پالیسی وضاحت کرتی ہے کہ ہم آپ کی معلومات کو کیسے جمع، استعمال اور
              محفوظ کرتے ہیں جب آپ ہماری ایپ استعمال کرتے ہیں۔
            </Text>

            <Text style={styles.heading}>2. ہم کون سی معلومات جمع کرتے ہیں</Text>
            <Text style={styles.paragraph}>
              2.1 چیٹ کی تاریخ: آپ کی گفتگو اور قانونی سوالات آپ کے آلے پر مقامی طور پر
              محفوظ ہوتے ہیں۔{'\n'}
              2.2 زبان کی ترجیح: آپ کی منتخب کردہ زبان (اردو/انگریزی) مقامی طور پر محفوظ ہوتی ہے۔{'\n'}
              2.3 ہم آپ کا نام، ای میل، فون نمبر، یا ذاتی شناخت کنندگان جمع نہیں کرتے۔
            </Text>

            <Text style={styles.heading}>3. ہم آپ کی معلومات کیسے استعمال کرتے ہیں</Text>
            <Text style={styles.paragraph}>
              3.1 آپ کے سوالات Google Gemini AI کو جوابات پیدا کرنے کے لیے بھیجے جاتے ہیں۔{'\n'}
              3.2 چیٹ کی تاریخ صرف اس لیے محفوظ کی جاتی ہے تاکہ آپ اپنی پچھلی گفتگو دیکھ سکیں۔{'\n'}
              3.3 ہم آپ کے ڈیٹا کو کسی تیسرے فریق کو فروخت یا شیئر نہیں کرتے۔
            </Text>

            <Text style={styles.heading}>4. ڈیٹا اسٹوریج</Text>
            <Text style={styles.paragraph}>
              تمام ڈیٹا صرف آپ کے آلے پر مقامی طور پر (AsyncStorage میں) محفوظ ہوتا ہے۔
              ہمارے پاس آپ کے ڈیٹا تک رسائی نہیں ہے۔ جب آپ ایپ کو ان انسٹال کرتے ہیں
              تو تمام ڈیٹا خود بخود حذف ہو جاتا ہے۔
            </Text>

            <Text style={styles.heading}>5. تیسرے فریق کی خدمات</Text>
            <Text style={styles.paragraph}>
              ہم آپ کے قانونی سوالات کے جوابات پیدا کرنے کے لیے AI استعمال
              کرتے ہیں۔ آپ کے پیغامات Google کے سرورز پر کارروائی ہوتے ہیں۔
              براہ کرم Google کی رازداری کی پالیسی دیکھیں۔
            </Text>

            <Text style={styles.heading}>6. ڈیٹا کنٹرول</Text>
            <Text style={styles.paragraph}>
              آپ سیٹنگز میں جا کر کسی بھی وقت اپنی چیٹ کی تاریخ کو حذف کر سکتے ہیں۔
            </Text>

            <Text style={styles.heading}>7. ہم سے رابطہ</Text>
            <Text style={styles.paragraph}>
              اگر آپ کو اس پالیسی کے بارے میں کوئی سوال ہے تو براہ کرم ایپ کے ذریعے
              رابطہ کریں۔
            </Text>

            <Text style={styles.heading}>8. تبدیلیاں</Text>
            <Text style={styles.paragraph}>
              ہم اس پالیسی کو کبھی کبھار اپ ڈیٹ کر سکتے ہیں۔ تبدیلیوں کے لیے باقاعدگی
              سے چیک کریں۔
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.lastUpdated}>Last Updated: May 2026</Text>

            <Text style={styles.heading}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Haqooq app ("we", "our") is committed to protecting your privacy.
              This policy explains how we collect, use, and safeguard your
              information when you use our app.
            </Text>

            <Text style={styles.heading}>2. Information We Collect</Text>
            <Text style={styles.paragraph}>
              2.1 Chat History: Your conversations and legal questions are stored
              locally on your device.{'\n'}
              2.2 Language Preference: Your selected language (Urdu/English) is stored
              locally.{'\n'}
              2.3 We do not collect your name, email, phone number, or any personal
              identifiers.
            </Text>

            <Text style={styles.heading}>3. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              3.1 Your questions are sent to Google Gemini AI to generate responses.{'\n'}
              3.2 Chat history is stored only so you can revisit past conversations.{'\n'}
              3.3 We do not sell or share your data with any third party.
            </Text>

            <Text style={styles.heading}>4. Data Storage</Text>
            <Text style={styles.paragraph}>
              All data is stored locally on your device (in AsyncStorage). We have
              no access to your data. When you uninstall the app, all data is
              automatically deleted.
            </Text>

            <Text style={styles.heading}>5. Third-Party Services</Text>
            <Text style={styles.paragraph}>
              We use AI to generate responses to your legal questions.
              Your messages are processed on Google's servers. Please
              review Google's privacy policy.
            </Text>

            <Text style={styles.heading}>6. Data Control</Text>
            <Text style={styles.paragraph}>
              You can delete your chat history at any time from Settings.
            </Text>

            <Text style={styles.heading}>7. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this policy, please reach out through
              the app.
            </Text>

            <Text style={styles.heading}>8. Changes</Text>
            <Text style={styles.paragraph}>
              We may update this policy occasionally. Check back regularly for
              changes.
            </Text>
          </>
        )}
        <View style={{ height: insets.bottom + 40 }} />
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
  content: {
    padding: 20,
  },
  lastUpdated: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  heading: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primaryNavy,
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
});
