import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../constants/colors';
import { getLanguage } from '../utils/storage';

export default function TosScreen() {
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
          {language === 'ur' ? 'شرائط استعمال' : 'Terms of Service'}
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

            <Text style={styles.heading}>1. قبولیت</Text>
            <Text style={styles.paragraph}>
              حقوق ایپ استعمال کر کے آپ ان شرائط سے اتفاق کرتے ہیں۔ اگر آپ
              متفق نہیں ہیں تو ایپ استعمال نہ کریں۔
            </Text>

            <Text style={styles.heading}>2. عمومی معلومات — قانونی مشورہ نہیں</Text>
            <Text style={styles.paragraph}>
              حقوق AI کی طرف سے فراہم کردہ معلومات صرف عمومی قانونی معلومات ہیں۔
              یہ پیشہ ورانہ قانونی مشورہ نہیں ہے۔ ہم قانونی خدمات فراہم نہیں
              کرتے۔ کسی بھی قانونی معاملے کے لیے مستند وکیل سے مشورہ کریں۔
            </Text>

            <Text style={styles.heading}>3. ذمہ داری کا اعتراف</Text>
            <Text style={styles.paragraph}>
              ایپ کا استعمال آپ کی اپنی ذمہ داری پر ہے۔ ہم AI سے پیدا کردہ
              معلومات کی درستگی، مکمل性或 بروقت ہونے کی ضمانت نہیں دیتے۔
              ہم کسی بھی نقصان یا قانونی نتائج کے ذمہ دار نہیں ہوں گے۔
            </Text>

            <Text style={styles.heading}>4. AI مواد کی حدود</Text>
            <Text style={styles.paragraph}>
              AI ماڈل غلطیاں کر سکتے ہیں۔ قانونی معلومات تیزی سے تبدیل ہوتی
              ہیں۔ AI کی تجویز پر عمل کرنے سے پہلے ہمیشہ کسی وکیل سے تصدیق
              کریں۔
            </Text>

            <Text style={styles.heading}>5. ڈیٹا اور رازداری</Text>
            <Text style={styles.paragraph}>
              آپ کے سوالات آپ کے آلے پر مقامی طور پر محفوظ ہوتے ہیں۔ جوابات
              پیدا کرنے کے لیے ڈیٹا Google Gemini AI کو بھیجا جاتا ہے۔
              تفصیلات کے لیے ہماری رازداری کی پالیسی دیکھیں۔
            </Text>

            <Text style={styles.heading}>6. استعمال کی پابندیاں</Text>
            <Text style={styles.paragraph}>
              آپ ایپ کو غیر قانونی سرگرمیوں یا نقصان دہ مقاصد کے لیے استعمال
              نہیں کر سکتے۔
            </Text>

            <Text style={styles.heading}>7. رابطہ</Text>
            <Text style={styles.paragraph}>
              سوالات یا خدشات کے لیے ایپ کے ذریعے رابطہ کریں۔
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.lastUpdated}>Last Updated: May 2026</Text>

            <Text style={styles.heading}>1. Acceptance</Text>
            <Text style={styles.paragraph}>
              By using Haqooq you agree to these terms. If you do not agree,
              do not use the app.
            </Text>

            <Text style={styles.heading}>2. General Information — Not Legal Advice</Text>
            <Text style={styles.paragraph}>
              Information provided by Haqooq AI is for general informational
              purposes only. It does not constitute professional legal advice.
              We do not provide legal services. Consult a qualified lawyer for
              any legal matter.
            </Text>

            <Text style={styles.heading}>3. Acknowledgment of Responsibility</Text>
            <Text style={styles.paragraph}>
              You use the app at your own risk. We make no guarantees about the
              accuracy, completeness, or timeliness of AI-generated information.
              We are not liable for any damages or legal outcomes.
            </Text>

            <Text style={styles.heading}>4. Limitations of AI Content</Text>
            <Text style={styles.paragraph}>
              AI models can make mistakes. Laws change frequently. Always verify
              with a lawyer before acting on AI-generated suggestions.
            </Text>

            <Text style={styles.heading}>5. Data & Privacy</Text>
            <Text style={styles.paragraph}>
              Your questions are stored locally on your device. Data is sent to
              Google Gemini AI to generate responses. See our Privacy Policy for
              details.
            </Text>

            <Text style={styles.heading}>6. Usage Restrictions</Text>
            <Text style={styles.paragraph}>
              You may not use the app for illegal activities or harmful purposes.
            </Text>

            <Text style={styles.heading}>7. Contact</Text>
            <Text style={styles.paragraph}>
              Reach out through the app for questions or concerns.
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
