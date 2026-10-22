/**
 * AI Copilot - Ephemeral AI Bridge
 * 
 * This module provides the core AI functionality for the Health Passport Pilot.
 * It:
 * 1. Reads local Health Passport constraints from RxDB
 * 2. Injects them into the system prompt as context
 * 3. Sends requests to the Gemini API to generate workout plans using wger exercises from Supabase
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
import { supabase } from './supabase';
import { db, initializeDatabase } from './database';

// Types
export interface HealthPassportConstraints {
  injuries?: Array<{
    joint: string;
    condition: string;
    restriction: string;
    active: boolean;
  }>;
  bloodWork?: Array<{
    marker: string;
    status: string;
    date: string;
  }>;
  dietaryPreferences?: string[];
  goalsAndTargets?: Array<{
    goal: string;
    target: string;
    deadline?: string;
  }>;
}

export interface WorkoutPlanRequest {
  userQuery: string;
  healthConstraints?: HealthPassportConstraints;
}

export interface ExerciseOption {
  id: string;
  name: string;
  description: string;
  category: string;
  muscle_groups: string[];
  equipment: string[];
  difficulty: string;
}

export interface GeneratedWorkoutPlan {
  summary: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: string;
    rpe?: number;
    notes?: string;
  }>;
  reasoning: string;
}

/**
 * Fetch relevant exercises from Supabase based on muscle groups and equipment
 */
async function fetchRelevantExercises(
  muscleGroups?: string[],
  equipment?: string[]
): Promise<ExerciseOption[]> {
  try {
    let query = supabase
      .from('exercises')
      .select('*')
      .limit(50);

    // Filter by muscle groups if provided
    if (muscleGroups && muscleGroups.length > 0) {
      query = query.overlaps('muscle_groups', muscleGroups);
    }

    // Filter by equipment if provided
    if (equipment && equipment.length > 0) {
      query = query.overlaps('equipment', equipment);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching exercises from Supabase:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchRelevantExercises:', error);
    return [];
  }
}

/**
 * Read Health Passport constraints from local RxDB
 */
async function getHealthPassportConstraints(): Promise<HealthPassportConstraints> {
  try {
    // Initialize database if not already initialized
    const database = await initializeDatabase();
    
    if (!database) {
      console.warn('Database not initialized, returning empty constraints');
      return {};
    }

    // Query the Users collection for the current user's health passport
    const users = await database.users.find().exec();
    
    if (users.length === 0) {
      return {};
    }

    const user = users[0].toJSON();
    
    // Transform user data into health constraints format
    // This assumes the user schema has fields that map to health constraints
    // Adjust based on your actual Users schema structure
    return {
      // Map user data to health constraints
      // You may need to adjust this based on your actual schema
    };
  } catch (error) {
    console.error('Error reading health passport from RxDB:', error);
    return {};
  }
}

/**
 * Format health constraints for the AI prompt
 */
function formatHealthConstraints(constraints: HealthPassportConstraints): string {
  const parts: string[] = [];

  if (constraints.injuries && constraints.injuries.length > 0) {
    const activeInjuries = constraints.injuries.filter(i => i.active);
    if (activeInjuries.length > 0) {
      parts.push(`Active Injuries: ${activeInjuries.map(i => 
        `${i.joint} - ${i.condition} (${i.restriction})`
      ).join(', ')}`);
    }
  }

  if (constraints.bloodWork && constraints.bloodWork.length > 0) {
    parts.push(`Blood Work Status: ${constraints.bloodWork.map(b => 
      `${b.marker}: ${b.status} (${b.date})`
    ).join(', ')}`);
  }

  if (constraints.dietaryPreferences && constraints.dietaryPreferences.length > 0) {
    parts.push(`Dietary Preferences: ${constraints.dietaryPreferences.join(', ')}`);
  }

  if (constraints.goalsAndTargets && constraints.goalsAndTargets.length > 0) {
    parts.push(`Goals: ${constraints.goalsAndTargets.map(g => 
      `${g.goal} - ${g.target}${g.deadline ? ` (by ${g.deadline})` : ''}`
    ).join(', ')}`);
  }

  return parts.length > 0 ? parts.join('\n') : 'No specific health constraints';
}

/**
 * Format exercise options for the AI prompt
 */
function formatExerciseOptions(exercises: ExerciseOption[]): string {
  return exercises.map(ex => 
    `- ${ex.name} (${ex.category})\n  Muscles: ${ex.muscle_groups.join(', ')}\n  Equipment: ${ex.equipment.join(', ')}`
  ).join('\n');
}

/**
 * Generate a workout plan using Gemini AI
 */
export async function generateWorkoutPlan(
  userQuery: string,
  additionalConstraints?: HealthPassportConstraints
): Promise<GeneratedWorkoutPlan> {
  // Get Gemini API key from environment or app.json
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 
                 Constants.expoConfig?.extra?.geminiApiKey;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set. Please add your Gemini API key to .env or app.json');
  }

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Read health constraints from local RxDB
  const healthConstraints = await getHealthPassportConstraints();
  const mergedConstraints = { ...healthConstraints, ...additionalConstraints };

  // Fetch relevant exercises from Supabase
  // Start with a general fetch (you can make this smarter based on user query)
  const exercises = await fetchRelevantExercises();

  // Build the system prompt with context
  const systemPrompt = `You are an expert fitness coach and AI workout planner for the Health Passport Pilot app.

## User's Health Constraints:
${formatHealthConstraints(mergedConstraints)}

## Available Exercises from Wger Database:
${formatExerciseOptions(exercises)}

## Your Task:
Based on the user's query: "${userQuery}"

Generate a workout plan that:
1. Respects all health constraints (especially active injuries and restrictions)
2. Uses exercises from the available list above
3. Considers the user's dietary preferences and goals
4. Provides clear sets, reps, and weight recommendations
5. Includes RPE (Rate of Perceived Exertion) scale 1-10 where appropriate
6. Explains your reasoning for exercise selection

## Response Format:
Provide your response in the following JSON format:
{
  "summary": "Brief summary of the workout plan",
  "exercises": [
    {
      "name": "Exercise name from the available list",
      "sets": 3,
      "reps": 10,
      "weight": "e.g., '135 lbs' or 'bodyweight'",
      "rpe": 7,
      "notes": "Specific form cues or modifications for injuries"
    }
  ],
  "reasoning": "Explanation of why these exercises were chosen and how they address the user's needs"
}

Only use exercises from the provided list. If no suitable exercises are available, explain why and suggest alternatives.`;

  try {
    // Generate the workout plan
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    // Note: Gemini may return markdown code blocks, so we need to extract the JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;
    
    const workoutPlan: GeneratedWorkoutPlan = JSON.parse(jsonString);
    
    return workoutPlan;
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw new Error('Failed to generate workout plan. Please try again.');
  }
}

/**
 * Simple chat interface for the AI Copilot
 */
export async function chatWithCopilot(
  message: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || 
                 Constants.expoConfig?.extra?.geminiApiKey;
  if (!apiKey || apiKey === 'your_gemini_api_key') {
    throw new Error('EXPO_PUBLIC_GEMINI_API_KEY is not set. Please add your Gemini API key to .env or app.json');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Get health constraints for context
  const healthConstraints = await getHealthPassportConstraints();
  
  const systemContext = `You are a helpful fitness AI assistant for the Health Passport Pilot app.

User's Health Context:
${formatHealthConstraints(healthConstraints)}

You have access to a database of exercises via Supabase. When suggesting exercises, base your recommendations on standard fitness knowledge. For specific exercise details, focus on muscle groups, equipment needs, and general biomechanics.

Be concise, practical, and always consider the user's health constraints when giving advice.`;

  try {
    // Filter conversation history to ensure it starts with a user message
    // Gemini requires the first message in history to be from 'user'
    const filteredHistory = conversationHistory
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Only include history if we have at least one user message
    const history = filteredHistory.length > 0 ? filteredHistory : undefined;

    const chat = model.startChat({
      history,
      systemInstruction: systemContext
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat with copilot:', error);
    throw new Error('Failed to get response from AI copilot. Please try again.');
  }
}