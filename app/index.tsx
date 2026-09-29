import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';

export default function TrainingTab() {
  const [records, setRecords] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'workout',
    activityType: 'strength',
    duration: 45,
    readinessScore: 7,
    notes: ''
  });

  const addRecord = () => {
    const record = {
      id: Date.now().toString(),
      userId: 'default-user',
      type: 'workout',
      date: new Date().toISOString(),
      workout: {
        activityType: newRecord.activityType,
        duration: newRecord.duration,
        readinessScore: newRecord.readinessScore,
        exercises: []
      },
      notes: newRecord.notes,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRecords([...records, record]);
    setNewRecord({
      type: 'workout',
      activityType: 'strength',
      duration: 45,
      readinessScore: 7,
      notes: ''
    });
    setShowAddForm(false);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="pt-12 pb-4 px-4 bg-blue-50">
        <Text className="text-2xl font-bold text-gray-900">Training</Text>
        <Text className="text-gray-600 mt-1">Your workout calendar and execution</Text>
      </View>
      
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Workouts</Text>
            <TouchableOpacity 
              onPress={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-blue-500 rounded-lg"
            >
              <Text className="text-white font-medium text-sm">+ Add Workout</Text>
            </TouchableOpacity>
          </View>

          {showAddForm && (
            <View className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="font-medium text-gray-900 mb-3">New Workout</Text>
              
              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Activity Type</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  value={newRecord.activityType}
                  onChangeText={(text) => setNewRecord({...newRecord, activityType: text})}
                  placeholder="strength, cardio, rehab, flexibility"
                />
              </View>

              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Duration (minutes)</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  value={newRecord.duration.toString()}
                  onChangeText={(text) => setNewRecord({...newRecord, duration: parseInt(text) || 45})}
                  placeholder="45"
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Readiness Score (1-10)</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  value={newRecord.readinessScore.toString()}
                  onChangeText={(text) => setNewRecord({...newRecord, readinessScore: parseInt(text) || 7})}
                  placeholder="7"
                  keyboardType="numeric"
                />
              </View>

              <View className="mb-3">
                <Text className="text-sm text-gray-600 mb-1">Notes</Text>
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg p-2 text-gray-900"
                  value={newRecord.notes}
                  onChangeText={(text) => setNewRecord({...newRecord, notes: text})}
                  placeholder="How do you feel?"
                  multiline
                />
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={addRecord}
                  className="flex-1 px-4 py-2 bg-blue-500 rounded-lg"
                >
                  <Text className="text-white font-medium text-sm text-center">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
                >
                  <Text className="text-gray-700 font-medium text-sm text-center">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {records.length === 0 ? (
            <View className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Text className="text-gray-600 text-sm text-center">
                No workouts recorded yet. Tap "Add Workout" to get started.
              </Text>
            </View>
          ) : (
            records.map((record) => (
              <View key={record.id} className="mb-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 capitalize">
                      {record.workout?.activityType || 'Workout'}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </Text>
                    {record.workout?.duration && (
                      <Text className="text-sm text-gray-500">
                        Duration: {record.workout.duration} min
                      </Text>
                    )}
                    {record.workout?.readinessScore && (
                      <Text className="text-sm text-gray-500">
                        Readiness: {record.workout.readinessScore}/10
                      </Text>
                    )}
                    {record.notes && (
                      <Text className="text-sm text-gray-600 mt-1">{record.notes}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
