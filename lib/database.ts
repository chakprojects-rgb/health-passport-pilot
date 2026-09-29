import { createRxDatabase } from 'rxdb';
import { getRxStorageSQLite } from '@basepurpose/rxdb-sqlite/react-native';
import { addRxPlugin } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

// Enable dev mode for development
addRxPlugin(RxDBDevModePlugin);

// Users Collection Schema (for local profile)
const usersSchema = {
  title: "users",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
    profile: {
      type: "object",
      properties: {
        age: { type: "number" },
        weight: { type: "number" },
        height: { type: "number" },
        gender: { type: "string" }
      }
    },
    preferences: {
      type: "object",
      properties: {
        units: { type: "string", enum: ["metric", "imperial"] },
        notifications: { type: "boolean" },
        darkMode: { type: "boolean" }
      }
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "name", "createdAt", "updatedAt"]
};

// Records Collection Schema (for health logs/workouts)
const recordsSchema = {
  title: "records",
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: { type: "string" },
    userId: { type: "string" },
    type: { 
      type: "string",
      enum: ["workout", "health_log", "nutrition", "sleep", "recovery"]
    },
    date: { type: "string", format: "date-time" },
    
    // Workout specific fields
    workout: {
      type: "object",
      properties: {
        activityType: { type: "string", enum: ["strength", "cardio", "rehab", "flexibility"] },
        duration: { type: "number" },
        readinessScore: { type: "number", minimum: 1, maximum: 10 },
        exercises: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              sets: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    reps: { type: "number" },
                    weight: { type: "number" },
                    rpe: { type: "number", minimum: 1, maximum: 10 }
                  }
                }
              }
            }
          }
        }
      }
    },
    
    // Health log specific fields
    healthLog: {
      type: "object",
      properties: {
        metrics: {
          type: "object",
          properties: {
            heartRate: { type: "number" },
            bloodPressure: { type: "string" },
            weight: { type: "number" },
            bodyFat: { type: "number" }
          }
        },
        symptoms: {
          type: "array",
          items: {
            type: "object",
            properties: {
              area: { type: "string" },
              severity: { type: "number", minimum: 1, maximum: 10 },
              description: { type: "string" }
            }
          }
        }
      }
    },
    
    // General fields for all record types
    notes: { type: "string" },
    tags: {
      type: "array",
      items: { type: "string" }
    },
    attachments: {
      type: "array",
      items: { type: "string" }
    },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" }
  },
  required: ["id", "userId", "type", "date", "createdAt", "updatedAt"]
};

export async function createDatabase() {
  const db = await createRxDatabase({
    name: 'health-passport-db',
    storage: getRxStorageSQLite({
      debug: false,
      pragma: {
        journal_mode: 'WAL',
        synchronous: 'NORMAL',
        cache_size: -64000,
        temp_store: 'MEMORY'
      }
    }),
    multiInstance: false,
    ignoreDuplicate: true
  });

  console.log('RxDB database created successfully');

  // Add collections
  await db.addCollections({
    users: {
      schema: usersSchema
    },
    records: {
      schema: recordsSchema
    }
  });

  console.log('RxDB collections added successfully');
  return db;
}

export let db: any = null;

export async function initializeDatabase() {
  if (!db) {
    db = await createDatabase();
  }
  return db;
}