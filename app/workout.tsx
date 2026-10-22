import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Slider } from '@react-native-community/slider';

export default function WorkoutScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dates, setDates] = useState<Date[]>([]);
  
  // Readiness scores
  const [sleepScore, setSleepScore] = useState(5);
  const [sorenessScore, setSorenessScore] = useState(5);
  const [energyScore, setEnergyScore] = useState(5);

  // Generate dates for the next 30 days
  useEffect(() => {
    const today = new Date();
    const dateArray: Date[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateArray.push(date);
    }
    setDates(dateArray);
  }, []);

  const formatDate = (date: Date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const activityTypes = [
    { id: 'workout', label: 'Workout', icon: '🏋️' },
    { id: 'cardio', label: 'Cardio', icon: '🏃' },
    { id: 'stretch', label: 'Stretch/Mobility', icon: '🧘' },
    { id: 'physio', label: 'Physio', icon: '🏥' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'testing', label: 'Physical Testing', icon: '📊' },
    { id: 'other', label: 'Others', icon: '📝' },
  ];

  const handleActivityPress = (activityType: string) => {
    router.push({
      pathname: '/active-session',
      params: { activityType }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Log</Text>
        <Text style={styles.subtitle}>Track your training sessions</Text>
      </View>

      {/* Horizontal Scrollable Calendar */}
      <View style={styles.calendarContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScroll}
        >
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCard,
                isSelected(date) && styles.selectedDateCard
              ]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[
                styles.dayName,
                isSelected(date) && styles.selectedDayName
              ]}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </Text>
              <Text style={[
                styles.dayNumber,
                isSelected(date) && styles.selectedDayNumber
              ]}>
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Selected Date Display */}
      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateLabel}>Selected Date:</Text>
        <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Daily Readiness Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Readiness</Text>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Sleep</Text>
              <Text style={styles.sliderValue}>{sleepScore}/10</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={sleepScore}
              onValueChange={setSleepScore}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#3b82f6"
            />
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Soreness</Text>
              <Text style={styles.sliderValue}>{sorenessScore}/10</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={sorenessScore}
              onValueChange={setSorenessScore}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#3b82f6"
            />
          </View>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>Energy</Text>
              <Text style={styles.sliderValue}>{energyScore}/10</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={energyScore}
              onValueChange={setEnergyScore}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#3b82f6"
            />
          </View>
        </View>

        {/* Log an Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log an Activity</Text>
          
          <View style={styles.activityGrid}>
            {activityTypes.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityButton}
                onPress={() => handleActivityPress(activity.id)}
              >
                <Text style={styles.activityIcon}>{activity.icon}</Text>
                <Text style={styles.activityLabel}>{activity.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  calendarContainer: {
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  calendarScroll: {
    paddingHorizontal: 16,
  },
  dateCard: {
    width: 70,
    height: 80,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateCard: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  dayName: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  selectedDayName: {
    color: '#ffffff',
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  selectedDayNumber: {
    color: '#ffffff',
  },
  selectedDateContainer: {
    padding: 20,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectedDateLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  sliderValue: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  activityButton: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  activityLabel: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
});