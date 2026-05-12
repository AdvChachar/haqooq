import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export default function ChatBubble({ message, isUser }) {
  const isRTL = /[\u0600-\u06FF]/.test(message.content);

  return (
    <View style={[styles.row, isUser ? styles.userRow : styles.aiRow]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>⚖️</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.aiText,
            isRTL && styles.rtlText,
          ]}
        >
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    marginHorizontal: 12,
    alignItems: 'flex-end',
  },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.goldAccent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 4,
  },
  avatarText: { fontSize: 16 },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: COLORS.primaryNavy,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: { color: COLORS.userBubbleText },
  aiText: { color: COLORS.aiBubbleText },
  rtlText: { textAlign: 'right' },
  timestamp: { fontSize: 10, marginTop: 4 },
  userTimestamp: { color: 'rgba(255,255,255,0.6)', textAlign: 'right' },
  aiTimestamp: { color: COLORS.textSecondary },
});
