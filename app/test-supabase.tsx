import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TestSupabaseScreen() {
  const [connectionStatus, setConnectionStatus] = useState('Not tested');
  const [authStatus, setAuthStatus] = useState('Not tested');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setConnectionStatus('Testing...');
    try {
      // Test basic connection by checking if we can query the database
      const { data, error } = await supabase
        .from('exercises')
        .select('id, name')
        .limit(1);
      
      if (error) {
        setConnectionStatus('❌ Failed');
        Alert.alert('Error', 'Connection failed: ' + error.message);
      } else {
        setConnectionStatus('✅ Connected');
        Alert.alert('Success', 'Supabase connection successful!');
      }
    } catch (error: any) {
      setConnectionStatus('❌ Error');
      Alert.alert('Error', 'Test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    setAuthStatus('Testing...');
    try {
      // Test auth by getting current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        setAuthStatus('❌ Failed');
        Alert.alert('Error', 'Auth failed: ' + error.message);
      } else {
        setAuthStatus('✅ Auth Working');
        Alert.alert('Success', 'Supabase auth successful!');
      }
    } catch (error: any) {
      setAuthStatus('❌ Error');
      Alert.alert('Error', 'Test failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Supabase Connection Test</Text>
        
        <View style={styles.testSection}>
          <Text style={styles.label}>Database Connection:</Text>
          <Text style={styles.status}>{connectionStatus}</Text>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testConnection}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test Connection</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.testSection}>
          <Text style={styles.label}>Authentication:</Text>
          <Text style={styles.status}>{authStatus}</Text>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={testAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test Auth</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  testSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});