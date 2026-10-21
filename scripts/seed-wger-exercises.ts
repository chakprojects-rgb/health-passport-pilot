/**
 * Wger Exercise Database Seeding Script
 * 
 * This script fetches exercise data from the wger API and seeds it into Supabase.
 * It fetches:
 * - Exercises (with metadata)
 * - Exercise translations (for names and descriptions)
 * - Muscles (for muscle group names)
 * - Equipment (for equipment names)
 * - Exercise categories (for category names)
 * 
 * Then it transforms and inserts the data into the Supabase exercises table.
 */

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Wger API base URL
const WGER_API_BASE = 'https://wger.de/api/v2';

// Helper function to fetch all pages from paginated API
async function fetchAllPages(endpoint: string) {
  let url = endpoint;
  const results: any[] = [];
  
  while (url) {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    const data = await response.json();
    
    results.push(...data.results);
    url = data.next || null;
  }
  
  return results;
}

// Fetch all data from wger
async function fetchWgerData() {
  console.log('Fetching data from wger API...');
  
  // Fetch exercises (paginated)
  const exercises = await fetchAllPages(`${WGER_API_BASE}/exercise/`);
  console.log(`Fetched ${exercises.length} exercises`);
  
  // Fetch exercise translations (for names and descriptions)
  const translations = await fetchAllPages(`${WGER_API_BASE}/exercise-translation/`);
  console.log(`Fetched ${translations.length} exercise translations`);
  
  // Fetch muscles
  const musclesResponse = await fetch(`${WGER_API_BASE}/muscle/`);
  const musclesData = await musclesResponse.json();
  const muscles = musclesData.results;
  console.log(`Fetched ${muscles.length} muscles`);
  
  // Fetch equipment
  const equipmentResponse = await fetch(`${WGER_API_BASE}/equipment/`);
  const equipmentData = await equipmentResponse.json();
  const equipment = equipmentData.results;
  console.log(`Fetched ${equipment.length} equipment items`);
  
  // Fetch exercise categories
  const categoriesResponse = await fetch(`${WGER_API_BASE}/exercisecategory/`);
  const categoriesData = await categoriesResponse.json();
  const categories = categoriesData.results;
  console.log(`Fetched ${categories.length} exercise categories`);
  
  return { exercises, translations, muscles, equipment, categories };
}

// Transform wger data to Supabase format
function transformWgerData(data: any) {
  const { exercises, translations, muscles, equipment, categories } = data;
  
  // Create lookup maps
  const muscleMap = new Map(muscles.map((m: any) => [m.id, m.name_en || m.name]));
  const equipmentMap = new Map(equipment.map((e: any) => [e.id, e.name]));
  const categoryMap = new Map(categories.map((c: any) => [c.id, c.name]));
  
  // Create translation map (exercise id -> translation)
  const translationMap = new Map();
  translations.forEach((t: any) => {
    if (!translationMap.has(t.exercise)) {
      translationMap.set(t.exercise, []);
    }
    translationMap.get(t.exercise).push(t);
  });
  
  // Transform exercises
  const transformedExercises = exercises.map((exercise: any) => {
    const exerciseTranslations = translationMap.get(exercise.id) || [];
    const englishTranslation = exerciseTranslations.find((t: any) => t.language === 2) || exerciseTranslations[0];
    
    // Get muscle group names
    const muscleGroups = [
      ...(exercise.muscles || []).map((id: number) => muscleMap.get(id) || '').filter(Boolean),
      ...(exercise.muscles_secondary || []).map((id: number) => muscleMap.get(id) || '').filter(Boolean),
    ];
    
    // Get equipment names
    const equipmentNames = (exercise.equipment || [])
      .map((id: number) => equipmentMap.get(id) || '')
      .filter(Boolean);
    
    // Get category name
    const categoryName = categoryMap.get(exercise.category) || '';
    
    return {
      name: englishTranslation?.name || `Exercise ${exercise.id}`,
      description: englishTranslation?.description || '',
      category: categoryName,
      muscle_groups: muscleGroups,
      equipment: equipmentNames,
      difficulty: 'intermediate', // wger doesn't provide difficulty, default to intermediate
    };
  });
  
  return transformedExercises;
}

// Seed data to Supabase
async function seedSupabase(exercises: any[]) {
  console.log(`Seeding ${exercises.length} exercises to Supabase...`);
  
  // Temporarily disable RLS using a service key (for seeding only)
  // Since we don't have a service key, we'll use the anon key with the updated policy
  // If this still fails, the user needs to manually disable RLS in Supabase dashboard
  
  // Clear existing exercises
  console.log('Clearing existing exercises...');
  const { error: deleteError } = await supabase
    .from('exercises')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (deleteError) {
    console.error('Error clearing exercises:', deleteError);
    // Continue anyway - table might be empty
  }
  
  // Insert exercises in batches of 100
  const batchSize = 100;
  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize);
    console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(exercises.length / batchSize)}...`);
    
    const { error } = await supabase
      .from('exercises')
      .insert(batch);
    
    if (error) {
      console.error('Error inserting batch:', error);
      console.error('\n❌ RLS policy is still blocking inserts.');
      console.error('Please run this SQL in your Supabase SQL Editor to disable RLS temporarily:');
      console.error('ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;');
      console.error('Then re-run this script. After seeding, re-enable RLS with:');
      console.error('ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;');
      throw error;
    }
  }
  
  console.log('Seeding complete!');
}

// Main function
async function main() {
  try {
    console.log('Starting wger exercise database seeding...');
    
    // Fetch data from wger
    const wgerData = await fetchWgerData();
    
    // Transform data
    console.log('Transforming data...');
    const transformedExercises = transformWgerData(wgerData);
    console.log(`Transformed ${transformedExercises.length} exercises`);
    
    // Seed to Supabase
    await seedSupabase(transformedExercises);
    
    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the script
main();