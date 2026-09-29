import "../global.css";
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: '#9CA3AF',
      headerShown: false,
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Training',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🏋️</Text>
          )
        }} 
      />
      <Tabs.Screen 
        name="passport" 
        options={{ 
          title: 'Passport',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>📋</Text>
          )
        }} 
      />
      <Tabs.Screen 
        name="copilot" 
        options={{ 
          title: 'AI Copilot',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🤖</Text>
          )
        }} 
      />
    </Tabs>
  );
}
