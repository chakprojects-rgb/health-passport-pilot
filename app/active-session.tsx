import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ActiveSessionScreen() {
  const router = useRouter();
  const { activityType } = useLocalSearchParams<{ activityType: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Active Session</Text>
        <Text style={styles.subtitle}>Activity Type: {activityType || 'Unknown'}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholderText}>
          This is a placeholder screen for logging a {activityType} session.
        </Text>
        <Text style={styles.placeholderText}>
          Session tracking functionality will be implemented here.
        </Text>
      </View>
    </View>
  );
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 12,
  },
});