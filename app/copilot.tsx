import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';
import { chatWithCopilot, generateWorkoutPlan } from '../lib/ai-copilot';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f0fdf4',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  chatSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  assistantMessage: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  userMessage: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    alignSelf: 'flex-end',
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  assistantLabel: {
    color: '#166534',
  },
  userLabel: {
    color: '#1e40af',
  },
  messageText: {
    fontSize: 14,
    color: '#374151',
  },
  loadingContainer: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 80,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  featuresSection: {
    marginTop: 24,
  },
  featureCard: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default function CopilotTab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI training assistant. I can help you with workout planning, exercise suggestions, and answer questions about your training data.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Check if the user is asking for a workout plan
      const isWorkoutRequest = userMessage.toLowerCase().includes('workout') || 
                               userMessage.toLowerCase().includes('plan') ||
                               userMessage.toLowerCase().includes('routine');

      let response: string;
      
      if (isWorkoutRequest) {
        // Use workout plan generator
        const plan = await generateWorkoutPlan(userMessage);
        response = `## ${plan.summary}\n\n### Exercises:\n${plan.exercises.map(ex => 
          `- **${ex.name}**: ${ex.sets} sets × ${ex.reps} reps${ex.weight ? ` @ ${ex.weight}` : ''}${ex.rpe ? ` (RPE ${ex.rpe})` : ''}${ex.notes ? `\n  Note: ${ex.notes}` : ''}`
        ).join('\n')}\n\n### Reasoning:\n${plan.reasoning}`;
      } else {
        // Use general chat
        const conversationHistory = messages.map(m => ({
          role: m.role,
          content: m.content
        }));
        response = await chatWithCopilot(userMessage, conversationHistory);
      }

      // Add AI response
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error('Error in AI chat:', error);
      Alert.alert('Error', error.message || 'Failed to get response from AI. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Copilot</Text>
        <Text style={styles.subtitle}>Your intelligent training assistant</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Chat Interface */}
          <View style={styles.chatSection}>
            <Text style={styles.sectionTitle}>Chat</Text>
            
            {messages.map((message, index) => (
              <View 
                key={index} 
                style={[
                  styles.messageContainer,
                  message.role === 'assistant' ? styles.assistantMessage : styles.userMessage
                ]}
              >
                <Text style={[
                  styles.messageLabel,
                  message.role === 'assistant' ? styles.assistantLabel : styles.userLabel
                ]}>
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'}
                </Text>
                <Text style={styles.messageText}>
                  {message.content}
                </Text>
              </View>
            ))}

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text style={styles.loadingText}>AI is thinking...</Text>
              </View>
            )}
          </View>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me anything about your training..."
              multiline
              numberOfLines={4}
              value={inputText}
              onChangeText={setInputText}
              editable={!loading}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                onPress={handleSendMessage}
                disabled={loading || !inputText.trim()}
                style={[
                  styles.sendButton,
                  (loading || !inputText.trim()) && styles.sendButtonDisabled
                ]}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Features</Text>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Workout Planning</Text>
              <Text style={styles.featureDescription}>
                Ask for a workout plan and I'll generate one based on your health constraints and available exercises.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Health-Aware Suggestions</Text>
              <Text style={styles.featureDescription}>
                All recommendations consider your injuries, blood work, and dietary preferences from your Health Passport.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Exercise Database</Text>
              <Text style={styles.featureDescription}>
                I have access to 932+ exercises from the wger database with detailed muscle and equipment information.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
