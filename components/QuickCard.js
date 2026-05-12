import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

export default function QuickCard({ item, onPress, language = 'ur' }) {
  const title = language === 'ur' ? item.titleUr : item.titleEn;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text
        style={[styles.title, language === 'ur' && styles.urduTitle]}
        numberOfLines={2}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 14,
    width: 110,
    alignItems: 'center',
    marginRight: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 22 },
  title: {
    fontSize: 12,
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 17,
  },
  urduTitle: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 20,
  },
});
