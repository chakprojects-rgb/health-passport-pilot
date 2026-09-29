import { View, Text, ScrollView, TextInput } from 'react-native';

export default function CopilotTab() {
  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 pb-4 px-4 bg-green-50">
        <Text className="text-2xl font-bold text-gray-900">AI Copilot</Text>
        <Text className="text-gray-600 mt-1">Your intelligent training assistant</Text>
      </View>
      
      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Chat Interface */}
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Chat</Text>
            
            {/* Sample AI Response */}
            <View className="mb-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Text className="text-sm font-medium text-green-800 mb-1">AI Assistant</Text>
              <Text className="text-gray-700 text-sm">
                Hello! I'm your AI training assistant. I can help you with workout planning, exercise suggestions, and answer questions about your training data.
              </Text>
            </View>

            {/* Sample User Message */}
            <View className="mb-3 p-4 bg-blue-50 rounded-lg border border-blue-200 self-end">
              <Text className="text-sm font-medium text-blue-800 mb-1">You</Text>
              <Text className="text-gray-700 text-sm">
                How can I modify my workout for today?
              </Text>
            </View>
          </View>

          {/* Input Area */}
          <View className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <TextInput
              className="bg-white border border-gray-300 rounded-lg p-3 text-gray-900"
              placeholder="Ask me anything about your training..."
              multiline
              numberOfLines={4}
            />
            <View className="mt-3 flex-row justify-end">
              <View className="px-4 py-2 bg-blue-500 rounded-lg">
                <Text className="text-white font-medium text-sm">Send</Text>
              </View>
            </View>
          </View>

          {/* Features Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Features</Text>
            
            <View className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="font-medium text-gray-900 mb-1">Workout Modification</Text>
              <Text className="text-gray-600 text-sm">
                Get AI suggestions to modify your workouts based on your health passport and current state.
              </Text>
            </View>

            <View className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="font-medium text-gray-900 mb-1">Semantic Search</Text>
              <Text className="text-gray-600 text-sm">
                Search through your workout notes and logs using natural language.
              </Text>
            </View>

            <View className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="font-medium text-gray-900 mb-1">Exercise Suggestions</Text>
              <Text className="text-gray-600 text-sm">
                Get personalized exercise recommendations based on your goals and restrictions.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
