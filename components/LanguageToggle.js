import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function LanguageToggle({ language, onToggle }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, language === 'ur' && styles.activeOption]}
        onPress={() => onToggle('ur')}
        activeOpacity={0.8}
      >
        <Text style={[styles.optionText, language === 'ur' && styles.activeText]}>
          اردو
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, language === 'en' && styles.activeOption]}
        onPress={() => onToggle('en')}
        activeOpacity={0.8}
      >
        <Text style={[styles.optionText, language === 'en' && styles.activeText]}>
          EN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 3,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  activeOption: {
    backgroundColor: COLORS.goldAccent,
  },
  optionText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  activeText: {
    color: COLORS.primaryNavy,
    fontWeight: '700',
  },
});
