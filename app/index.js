import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import COLORS from '../constants/colors';

export default function SplashScreen() {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/home');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoInner}>
          <Text style={styles.logoEmoji}>⚖️</Text>
        </View>
        <View style={styles.logoBadge}>
          <Text style={styles.logoBadgeText}>AI</Text>
        </View>
      </Animated.View>

      {/* Urdu Title */}
      <Animated.Text style={[styles.appNameUrdu, { opacity: titleOpacity }]}>
        حقوق
      </Animated.Text>

      {/* English Title */}
      <Animated.Text style={[styles.appNameEn, { opacity: subtitleOpacity }]}>
        HAQOOQ
      </Animated.Text>

      {/* Tagline */}
      <Animated.View style={[styles.taglineContainer, { opacity: taglineOpacity }]}>
        <View style={styles.goldLine} />
        <Text style={styles.taglineUrdu}>قانونی مدد — ہر شہری کا حق</Text>
        <Text style={styles.taglineEn}>Legal Aid for Every Citizen</Text>
        <View style={styles.goldLine} />
      </Animated.View>

      <Animated.Text style={[styles.bottomText, { opacity: taglineOpacity }]}>
        Balochistan Legal Aid Initiative
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(201,168,76,0.08)',
    top: -80,
    right: -80,
  },
  bgCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: 60,
    left: -60,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 28,
  },
  logoInner: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: COLORS.goldAccent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
  },
  logoEmoji: { fontSize: 50 },
  logoBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: COLORS.primaryNavy,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: COLORS.goldAccent,
  },
  logoBadgeText: {
    color: COLORS.goldAccent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  appNameUrdu: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  appNameEn: {
    color: COLORS.goldAccent,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 8,
    marginBottom: 32,
  },
  taglineContainer: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  goldLine: {
    width: 60,
    height: 2,
    backgroundColor: COLORS.goldAccent,
    borderRadius: 1,
    opacity: 0.6,
  },
  taglineUrdu: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    textAlign: 'center',
  },
  taglineEn: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    letterSpacing: 1,
    textAlign: 'center',
  },
  bottomText: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});