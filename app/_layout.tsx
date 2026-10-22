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
        name="workout" 
        options={{ 
          title: 'Workout',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>📅</Text>
          )
        }} 
      />
      <Tabs.Screen 
        name="passport" 
        options={{ 
          title: 'Health Passport',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>�</Text>
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
      {/* Hide other tabs from navigation bar */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          href: null
        }} 
      />
      <Tabs.Screen 
        name="exercises" 
        options={{ 
          href: null
        }} 
      />
      <Tabs.Screen 
        name="active-session" 
        options={{ 
          href: null
        }} 
      />
    </Tabs>
  );
}
