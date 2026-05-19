import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../constants/colors';
import { setOnboarded, saveLanguage } from '../utils/storage';

const { width, height } = Dimensions.get('window');

const STEPS = [
  {
    icon: '⚖️',
    titleEn: 'Welcome to Haqooq',
    titleUr: 'حقوق میں خوش آمدید',
    descEn:
      'Your AI-powered legal aid assistant. Get simple, clear answers about Pakistani laws — in Urdu or English.',
    descUr:
      'آپ کا AI سے چلنے والا قانونی مددگار۔ پاکستانی قوانین کے بارے میں آسان اور صاف جوابات — اردو یا انگریزی میں۔',
  },
  {
    icon: '📱',
    titleEn: 'How It Works',
    titleUr: 'یہ کیسے کام کرتا ہے',
    descEn:
      'Type your legal question and Haqooq AI will respond with relevant legal information based on Pakistani law.',
    descUr:
      'اپنا قانونی سوال لکھیں اور حقوق AI پاکستانی قانون کی بنیاد پر متعلقہ معلومات فراہم کرے گا۔',
  },
  {
    icon: '⚠️',
    titleEn: 'Important Notice',
    titleUr: 'اہم نوٹس',
    descEn:
      'Haqooq provides general legal information only. It is NOT a substitute for professional legal advice. Always consult a qualified lawyer for serious legal matters.',
    descUr:
      'حقوق صرف عمومی قانونی معلومات فراہم کرتا ہے۔ یہ پیشہ ورانہ قانونی مشورے کا متبادل نہیں ہے۔ سنگین قانونی معاملات کے لیے ہمیشہ کسی مستند وکیل سے مشورہ کریں۔',
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [language, setLanguageState] = useState('ur');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const changeStep = (newStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(newStep);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleLanguageToggle = async (lang) => {
    setLanguageState(lang);
    await saveLanguage(lang);
  };

  const [declined, setDeclined] = useState(false);

  const handleAccept = async () => {
    await setOnboarded();
    router.replace('/home');
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  const handleGoBack = () => {
    setDeclined(false);
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" />

      <View style={styles.container}>
      {/* Language Toggle */}
      <View style={styles.langRow}>
        <TouchableOpacity
          style={[styles.langBtn, language === 'ur' && styles.langBtnActive]}
          onPress={() => handleLanguageToggle('ur')}
        >
          <Text
            style={[styles.langText, language === 'ur' && styles.langTextActive]}
          >
            اردو
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, language === 'en' && styles.langBtnActive]}
          onPress={() => handleLanguageToggle('en')}
        >
          <Text
            style={[styles.langText, language === 'en' && styles.langTextActive]}
          >
            English
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Dots */}
      <View style={styles.dotsRow}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === step && styles.dotActive]}
          />
        ))}
      </View>

      {/* Step Content */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
        ]}
      >
        <Text style={styles.stepIcon}>{current.icon}</Text>
        <Text style={[styles.stepTitle, language === 'ur' && styles.rtl]}>
          {language === 'ur' ? current.titleUr : current.titleEn}
        </Text>
        <Text style={[styles.stepDesc, language === 'ur' && styles.rtl]}>
          {language === 'ur' ? current.descUr : current.descEn}
        </Text>
      </Animated.View>

      {isLast && (
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerIcon}>📜</Text>
          <Text style={[styles.disclaimerText, language === 'ur' && styles.rtl]}>
            {language === 'ur'
              ? 'میں تصدیق کرتا/کرتی ہوں کہ میں سمجھ گیا/گئی ہوں کہ یہ ایپ قانونی مشورہ نہیں دیتی۔ میں اسے اپنی ذمہ داری پر استعمال کروں گا/گی۔'
              : 'I acknowledge that this app does not provide legal advice. I will use it at my own responsibility.'}
          </Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.btnRow}>
        {!isLast ? (
          <>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={handleAccept}
            >
              <Text style={styles.skipText}>
                {language === 'ur' ? 'چھوڑیں' : 'Skip'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => changeStep(step + 1)}
            >
              <Text style={styles.nextText}>
                {language === 'ur' ? 'آگے' : 'Next'} →
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={handleDecline}
            >
              <Text style={styles.declineText}>
                {language === 'ur' ? 'متفق نہیں' : 'Decline'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={handleAccept}
            >
              <Text style={styles.acceptText}>
                {language === 'ur' ? '✅ میں متفق ہوں' : '✅ I Agree'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      </View>

      {declined && (
        <View style={styles.blockedOverlay}>
          <Text style={styles.blockedIcon}>🚫</Text>
          <Text style={[styles.blockedTitle, language === 'ur' && styles.rtl]}>
            {language === 'ur'
              ? 'آپ کو ایپ استعمال کرنے کے لیے شرائط سے متفق ہونا ہوگا'
              : 'You must agree to continue using the app'}
          </Text>
          <Text style={[styles.blockedDesc, language === 'ur' && styles.rtl]}>
            {language === 'ur'
              ? 'براہ کرم واپس جائیں اور "میں متفق ہوں" پر ٹیپ کریں۔'
              : 'Please go back and tap "I Agree" to use Haqooq.'}
          </Text>
          <TouchableOpacity style={styles.goBackBtn} onPress={handleGoBack}>
            <Text style={styles.goBackText}>
              {language === 'ur' ? 'واپس جائیں' : 'Go Back'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.primaryNavy,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryNavy,
    paddingTop: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langRow: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 3,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langBtnActive: {
    backgroundColor: COLORS.goldAccent,
  },
  langText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  langTextActive: {
    color: COLORS.primaryNavy,
    fontWeight: '700',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: COLORS.goldAccent,
    width: 28,
    borderRadius: 5,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  stepIcon: {
    fontSize: 72,
    marginBottom: 24,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  rtl: {
    textAlign: 'right',
  },
  disclaimerBox: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 14,
    padding: 18,
    marginBottom: 32,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
    width: '100%',
  },
  disclaimerIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  disclaimerText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 20,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  skipBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  skipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    fontWeight: '600',
  },
  nextBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: COLORS.goldAccent,
  },
  nextText: {
    color: COLORS.primaryNavy,
    fontSize: 15,
    fontWeight: '700',
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
  },
  declineText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: COLORS.goldAccent,
  },
  acceptText: {
    color: COLORS.primaryNavy,
    fontSize: 15,
    fontWeight: '700',
  },
  blockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15,42,68,0.97)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    zIndex: 100,
  },
  blockedIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  blockedTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  blockedDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  goBackBtn: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
    backgroundColor: COLORS.goldAccent,
  },
  goBackText: {
    color: COLORS.primaryNavy,
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    position: 'absolute',
    bottom: 30,
    color: 'rgba(255,255,255,0.25)',
    fontSize: 12,
  },
});
