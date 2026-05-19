import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ChatBubble from '../components/ChatBubble';
import TypingIndicator from '../components/TypingIndicator';
import COLORS from '../constants/colors';
import { sendMessageToGemini, getErrorMessage } from '../utils/geminiAPI';
import {
  getLanguage,
  getChatHistory,
  saveChatHistory,
  clearChatHistory,
  SECTIONS,
} from '../utils/storage';
import { detectLanguage } from '../utils/languageDetect';

const generateId = () =>
  `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const SECTION_INFO = {
  [SECTIONS.FAMILY]: {
    icon: '👩‍⚖️',
    titleEn: 'Family Law',
    titleUr: 'خاندانی قانون',
    welcomeEn: 'Assalam-o-Alaikum! I am Haqooq AI.\n\nAsk me anything about Family Law — marriage, divorce, custody, inheritance, and more.\n\nHow can I help you today?',
    welcomeUr: 'السلام علیکم! میں حقوق AI ہوں۔\n\nخاندانی قانون کے بارے میں سوال پوچھیں — نکاح، طلاق، حضانت، وراثت وغیرہ۔\n\nآپ کا کیا سوال ہے؟',
  },
  [SECTIONS.CRIMINAL]: {
    icon: '📋',
    titleEn: 'Criminal Law',
    titleUr: 'فوجداری قانون',
    welcomeEn: 'Assalam-o-Alaikum! I am Haqooq AI.\n\nAsk me anything about Criminal Law — FIR filing, bail, arrests, and your rights.\n\nHow can I help you today?',
    welcomeUr: 'السلام علیکم! میں حقوق AI ہوں۔\n\nفوجداری قانون کے بارے میں سوال پوچھیں — ایف آئی آر، ضمانت، گرفتاری اور آپ کے حقوق۔\n\nآپ کا کیا سوال ہے؟',
  },
  [SECTIONS.PROPERTY]: {
    icon: '🏠',
    titleEn: 'Property Law',
    titleUr: 'جائیداد کا قانون',
    welcomeEn: 'Assalam-o-Alaikum! I am Haqooq AI.\n\nAsk me anything about Property Law — land rights, disputes, registration, and more.\n\nHow can I help you today?',
    welcomeUr: 'السلام علیکم! میں حقوق AI ہوں۔\n\nجائیداد کے قانون کے بارے میں سوال پوچھیں — زمین کے حقوق، تنازعات، رجسٹریشن وغیرہ۔\n\nآپ کا کیا سوال ہے؟',
  },
  [SECTIONS.LABOR]: {
    icon: '👷',
    titleEn: 'Labor Law',
    titleUr: 'مزدور قانون',
    welcomeEn: 'Assalam-o-Alaikum! I am Haqooq AI.\n\nAsk me anything about Labor Law — worker rights, wages, termination, and more.\n\nHow can I help you today?',
    welcomeUr: 'السلام علیکم! میں حقوق AI ہوں۔\n\nمزدور قانون کے بارے میں سوال پوچھیں — مزدور کے حقوق، تنخواہ، ملازمت وغیرہ۔\n\nآپ کا کیا سوال ہے؟',
  },
  [SECTIONS.OTHER]: {
    icon: '⚖️',
    titleEn: 'Haqooq AI',
    titleUr: 'حقوق AI',
    welcomeEn: "Assalam-o-Alaikum! I am Haqooq AI, your legal aid assistant.\n\nAsk me anything about Pakistani law — FIR filing, bail, divorce, CNIC, labor rights, women's rights, and more.\n\nHow can I help you today?",
    welcomeUr: 'السلام علیکم! میں حقوق AI ہوں۔ آپ کا قانونی مددگار۔\n\nآپ مجھ سے پاکستانی قانون کے بارے میں کوئی بھی سوال پوچھ سکتے ہیں — جیسے ایف آئی آر، ضمانت، طلاق، شناختی کارڈ، مزدور کے حقوق، وغیرہ۔\n\nآپ کا کیا سوال ہے؟',
  },
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const flatListRef = useRef(null);
  const initialQuestionSent = useRef(false);
  const messagesRef = useRef([]);

  const section = params?.section || SECTIONS.OTHER;
  const sectionInfo = SECTION_INFO[section] || SECTION_INFO[SECTIONS.OTHER];

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('ur');
  const [isLoading, setIsLoading] = useState(true);

  const updateMessages = (newMessages) => {
    messagesRef.current = newMessages;
    setMessages(newMessages);
  };

  useEffect(() => {
    initChat();
  }, [section]);

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const initChat = async () => {
    const [lang, history] = await Promise.all([
      getLanguage(),
      getChatHistory(section),
    ]);

    setLanguage(lang);

    let initial = [];

    if (history && history.length > 0) {
      initial = history;
    } else {
      const welcomeMsg = {
        id: generateId(),
        role: 'assistant',
        content: lang === 'ur' ? sectionInfo.welcomeUr : sectionInfo.welcomeEn,
        timestamp: Date.now(),
      };
      initial = [welcomeMsg];
    }

    updateMessages(initial);
    setIsLoading(false);

    if (params?.initialQuestion && !initialQuestionSent.current) {
      initialQuestionSent.current = true;
      setTimeout(() => {
        handleSend(params.initialQuestion, lang, initial);
      }, 600);
    }
  };

  const handleSend = useCallback(
    async (textOverride, langOverride, messagesOverride) => {
      const msgText = (textOverride || inputText).trim();
      const activeLang = langOverride || language;
      const currentMessages =
        messagesOverride !== undefined ? messagesOverride : messagesRef.current;

      if (!msgText) return;

      const userMsg = {
        id: generateId(),
        role: 'user',
        content: msgText,
        timestamp: Date.now(),
      };

      const withUser = [...currentMessages, userMsg];
      updateMessages(withUser);
      saveChatHistory(withUser, section);

      if (!textOverride) setInputText('');
      setIsTyping(true);
      scrollToBottom();

      try {
        const historyForApi = currentMessages
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }));

        const responseText = await sendMessageToGemini(
          msgText,
          historyForApi
        );

        const aiMsg = {
          id: generateId(),
          role: 'assistant',
          content: responseText,
          timestamp: Date.now(),
        };

        const withAi = [...withUser, aiMsg];
        updateMessages(withAi);
        saveChatHistory(withAi, section);
      } catch (error) {
        const detectedLang = detectLanguage(msgText);
        const errorText = getErrorMessage(error.message, detectedLang);

        const errorMsg = {
          id: generateId(),
          role: 'assistant',
          content: `❌ ${errorText}`,
          timestamp: Date.now(),
          isError: true,
        };

        const withError = [...withUser, errorMsg];
        updateMessages(withError);
      } finally {
        setIsTyping(false);
        scrollToBottom();
      }
    },
    [inputText, language, section]
  );

  const handleClearChat = () => {
    Alert.alert(
      language === 'ur' ? 'بات چیت صاف کریں' : 'Clear Chat',
      language === 'ur'
        ? 'کیا آپ تمام پیغامات حذف کرنا چاہتے ہیں؟'
        : 'Delete all messages?',
      [
        {
          text: language === 'ur' ? 'ہاں' : 'Yes',
          style: 'destructive',
          onPress: async () => {
            await clearChatHistory(section);
            initialQuestionSent.current = false;
            updateMessages([]);
            initChat();
          },
        },
        { text: language === 'ur' ? 'نہیں' : 'No', style: 'cancel' },
      ]
    );
  };

  const renderMessage = useCallback(
    ({ item }) => <ChatBubble message={item} isUser={item.role === 'user'} />,
    []
  );

  const keyExtractor = useCallback((item) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryNavy} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {sectionInfo.icon}{' '}
            {language === 'ur' ? sectionInfo.titleUr : sectionInfo.titleEn}
          </Text>
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>
              {language === 'ur' ? 'فعال' : 'Active'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearChat}>
          <Text style={styles.clearIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
      />

      <View
        style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder={
            language === 'ur'
              ? 'اپنا قانونی سوال لکھیں...'
              : 'Type your legal question...'
          }
          placeholderTextColor={COLORS.textSecondary}
          multiline
          maxLength={1000}
          textAlign={language === 'ur' ? 'right' : 'left'}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            (!inputText.trim() || isTyping) && styles.sendBtnDisabled,
          ]}
          onPress={() => handleSend()}
          disabled={!inputText.trim() || isTyping}
          activeOpacity={0.8}
        >
          {isTyping ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.sendIcon}>↑</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primaryNavy,
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  clearBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: { fontSize: 18 },
  messagesList: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.inputBorder,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryNavy,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.inputBorder,
    elevation: 0,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
});
