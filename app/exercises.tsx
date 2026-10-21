import { View, Text, ScrollView, TextInput, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscle_groups: string[];
  equipment: string[];
  difficulty: string;
}

export default function ExercisesScreen() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = exercises.filter(ex => 
        ex.name.toLowerCase().includes(searchText.toLowerCase()) ||
        ex.category.toLowerCase().includes(searchText.toLowerCase()) ||
        ex.muscle_groups.some(m => m.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchText, exercises]);

  const fetchExercises = async () => {
    try {
      console.log('=== Starting fetchExercises ===');
      console.log('Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .limit(50);

      if (error) {
        console.error('=== Error fetching exercises ===');
        console.error('Error details:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        Alert.alert('Error', `Failed to fetch exercises: ${error.message}`);
        return;
      }

      console.log(`=== Successfully fetched ${data?.length || 0} exercises ===`);
      console.log('Sample exercise:', data?.[0]);
      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (error) {
      console.error('=== Exception in fetchExercises ===');
      console.error('Error:', error);
      Alert.alert('Error', `Exception: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exercise Library</Text>
        <Text style={styles.subtitle}>932+ exercises from wger database</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises by name, muscle, or category..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading exercises...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {filteredExercises.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No exercises found</Text>
            </View>
          ) : (
            filteredExercises.map((exercise) => (
              <View key={exercise.id} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                
                <View style={styles.tagContainer}>
                  <Text style={styles.tagLabel}>Muscles:</Text>
                  <Text style={styles.tagText}>
                    {exercise.muscle_groups.join(', ') || 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.tagContainer}>
                  <Text style={styles.tagLabel}>Equipment:</Text>
                  <Text style={styles.tagText}>
                    {exercise.equipment.join(', ') || 'Bodyweight'}
                  </Text>
                </View>

                {exercise.description && (
                  <Text style={styles.description}>{exercise.description}</Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#3b82f6',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  tagLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginRight: 4,
  },
  tagText: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 18,
  },
});