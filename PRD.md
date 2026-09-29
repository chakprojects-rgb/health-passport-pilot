Product Requirements Document: AI-Augmented S&C Passport
1. Context & Business Rationale
1.1 Problem Statement
Despite an explosion of fitness data and applications, athletes suffer from data paralysis, decision fatigue and a lack of actionable guidance. The current landscape is fractured: wearables produce endless noisy metrics without telling the user what to do, while training logs demand high input effort but offer rigid, generic outputs. While offline experts (Physios, S&C coaches) provide the highly accurate, personalized guidance athletes need based on actual medical realities (MRIs, blood work), these resources are episodic, expensive, and disconnected from the athlete's daily execution.
1.2 Competitive Gap Analysis
The athletic training market currently fails to bridge the gap between static programming and daily physiological reality:
Wearable Tech (Apple Health, Garmin, Whoop): Data-heavy but insight-poor. They generate "readiness scores" but do not interact with or dynamically modify an athlete's prescribed training plan.
Static Logbooks (TeamBuildr, Notion): High-friction input with low retrieval value. Built for coaches to push generic volume, not for individuals to customize or dynamically adapt.
Generic AI (Gemini, ChatGPT): Capable of reducing decision fatigue, but lacks persistent memory or medical context. Without a "ground truth" architecture, they risk providing inaccurate or dangerous physical advice.
Offline Experts (PT, S&C): The gold standard for accuracy and personalization, but costly, not always available, and their insights (physio notes, blood tests) live offline, isolated from daily gym execution.
1.3 Core Product Vision
A personalized AI trainer and Health Passport that acts as the missing bridge between offline medical truth and online daily execution. By utilizing a "Memory-First" architecture, the app cuts through wearable data noise to provide safe, highly contextualized validation. It reduces athlete decision fatigue by knowing exactly what their PT said, what their blood work shows, and what their training block demands—serving the right adaptation at the exact moment of friction.
2. Core Mandate & Architectural Vision
A universal React Native (Expo) application serving as an athletic logbook and Health Passport. The app features a responsive design: a mobile-first UI for gym logging and a desktop-web view for macro program building. It utilizes a Cloud LLM API (Gemini) functioning as an "Expert-in-the-Loop" copilot to dynamically adapt training based on physical state and medical history.
3. Tech Stack Declarations
Framework: React Native with Expo (compiles to iOS and Web)
Styling: NativeWind (Tailwind CSS for React Native)
Database: RxDB (Local-first NoSQL) using the free, MIT-licensed @basepurpose/rxdb-sqlite community adapter and expo-sqlite engine.
AI Integration: Vercel AI SDK calling a Cloud API (Gemini API via Google AI Studio Free Tier - Flash models).
4. Information Architecture & Core Features
Tab 1: Training (Execution & Planning)
Mobile View (Micro): Chronological calendar. Tapping a day opens a daily log. Features 1-tap "Mark Complete" for pre-filled templates. Includes a daily Readiness/Soreness slider (1-10) at the top of each day's log.
Hybrid Omni-Input Logging: Combines the traditional structured form fields with a flexible natural language input box (supporting typed text and voice dictation). Users can manually type into strict boxes (e.g., sets, reps, weight) OR use the unstructured box to dictate "how I feel" or custom exercises. The system uses Cloud LLM Structured Outputs to instantly parse the unstructured text into validated JSON, auto-filling the structured fields.
Desktop View (Macro): 1-to-3 month Block Builder interface to assign exercises to specific days. This environment is designed for complex macro-planning and serves as the foundational architecture for future roadmap expansion—specifically, developing a multi-tenant Coach/Physio portal to further bridge offline medical/training expertise with the athlete's online daily execution.
Tab 2: Health Passport (The Ground Truth)
Medical Baseline: Static repository of long-term medical data (surgeries, chronic restrictions, blood work, macro targets).
Milestones & Targets: Active tracking of Health Goals and upcoming competitions (e.g., lacrosse tournaments, marathons, powerlifting/ hyrox meets)
Boundary Enforcement: Strictly separated from daily calendar noise to ensure the AI prioritizes hard physical boundaries (e.g., "ACL Reconstruction 2024") over temporary daily fatigue (e.g., "calf muscles feel tight after a long run").
Tab 3: AI Copilot (The Brain)
Universal Interface: A persistent chat interface for complex macro-planning, stretching and exercise suggestions, nutrition recipes, and physiological problem-solving.
Pull-based UX: The AI only speaks when spoken to or when explicitly asked to modify a workout.
Frictionless Brain Dump: Allows users to input quick notes or unstructured information dumps; the AI seamlessly synthesizes this data and connects it directly to the Tab 1 Calendar.
Semantic Note Searching: The Copilot acts as a search engine for the additionalNotes field. Users can ask natural language questions (e.g., "When was the last time my shoulder hurt during bench press?"), and the AI will query the local database's unstructured notes to retrieve the exact context and dates.
5. Strict AI Rules (Expert-in-the-Loop)
Because the target users are athletes and domain experts—and because data paralysis, information overlap, and AI hallucinations are critical issues today—AI autonomy is strictly limited in favor of transparency and user control.
The AI must NEVER silently alter a logged or planned workout.
Micro AI Modification: When the user taps "Modify Exercise" in Tab 1, the AI must explicitly cite data from the Health Passport as its reasoning.
Approval Gate: The UI must render [Approve & Update Workout] or [Reject] buttons for all AI-generated modifications in the UI stream.
Privacy: Personal Identifiable Information (PII) must be stripped from payload contexts before pinging the Cloud API.
6. Database Schema & AI Target Shapes (Data Contracts)
The application uses RxDB (JSON Schema) for local storage and Zod (via Vercel AI SDK) for extracting unstructured text. Crucial Rule: Both manual form inputs (UI) and AI-extracted inputs (Voice/Text) map to the exact same WorkoutLogschema to maintain a single source of truth on the local device.





A. Health Passport Collection (RxDB) - Ground Truth 
This structured format replaces generic text arrays, allowing the AI Copilot to run complex queries on injuries, blood markers, and dietary needs.

JSON
{
  "title": "HealthPassport",
  "version": 0,
  "primaryKey": "id",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "generalSummary": { "type": "string", "description": "Catch-all for general medical history not covered by specific injuries" },
    "injuries": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "jointOrArea": { "type": "string" },
          "condition": { "type": "string" },
          "restriction": { "type": "string" },
          "isActive": { "type": "boolean" }
        },
        "required": ["jointOrArea", "condition", "isActive"]
      }
    },
    "bloodWork": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "marker": { "type": "string" },
          "status": { "type": "string" },
          "date": { "type": "string", "format": "date-time" }
        }
      }
    },
    "dietaryPreferences": {
      "type": "array",
      "items": { "type": "string" },
      "description": "E.g., Vegan, Lactose Intolerant, High Protein"
    },
    "goalsAndTargets": { 
      "type": "array", 
      "items": { "type": "string" } 
    },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["id", "updatedAt"]
}


B. Workout Log Collection (Zod AI Mapping & RxDB Structure) 
The RxDB database schema strictly mirrors this Zod shape. Manual UI inputs populate these fields directly, while AI extraction auto-populates them via generateObject.
TypeScript
import { z } from "zod";

export const WorkoutLogSchema = z.object({
  id: z.string().describe("Unique UUID for the log"),
  type: z.enum(["strength", "cardio", "rehab"]).describe("Primary activity type"),
  date: z.string().describe("ISO Date string of the workout"),
  readinessScore: z.number().min(1).max(10).optional().describe("Readiness out of 10"),
  
  // Unstructured Capture (Overflow & Context for Tab 3 Copilot Search)
  additionalNotes: z.string().optional().describe("Any raw, unstructured text, feelings, or extra context that doesn't fit into strict metrics."),
  dailyTags: z.array(z.string()).optional().describe("General tags like sleep quality or mood."),
  nutritionNotes: z.array(z.string()).optional().describe("Notes on meals or supplements."),
  
  // Pain & Rehab Memory (Short-Term)
  painReports: z.array(
    z.object({
      joint: z.string(),
      painLevel: z.number().min(1).max(10).optional(),
      trigger: z.string().optional()
    })
  ).optional(),

  // Activity Execution Data (Matches UI Form Fields)
  exercises: z.array(
    z.object({
      name: z.string(),
      isCardio: z.boolean().optional(),
      distanceKm: z.number().optional(),
      durationMinutes: z.number().optional(),
      sets: z.array(
        z.object({
          reps: z.number().optional(),
          weight: z.number().optional(),
          rpe: z.number().min(1).max(10).optional()
        })
      ).optional()
    })
  ).optional()
});


7. Cost-Optimization & Infrastructure
To ensure this MVP remains virtually free during the pilot phase, the architecture will rely on:
Zero-Cost Local Database: RxDB combined with the open-source @basepurpose/rxdb-sqlite adapter ensures data is processed and stored on-device. This strictly avoids RxDB's 500-document premium trial limits and expensive cloud database costs.
Generous Free-Tier LLM: Integration with the Gemini API via Google AI Studio, leveraging its developer free tier (Gemini Flash models) for all AI inference.
8. Vibe Coding Implementation Sequence
(Note to AI Coding Agent: Do not build the entire app at once. Execute strictly step-by-step.)
Environment Foundation: Initialize the Expo project using the blank TypeScript template. Install and configure Expo Router, NativeWind (Tailwind), and RxDB with the @basepurpose/rxdb-sqlite adapter.
Schema Implementation: Create the RxDB database initialization file and formally define the RxDB collections for Users and Records.
Static UI Shell: Build the bottom tab navigation (Tabs 1, 2, and 3) and create the static UI components using NativeWind (no logic yet).
Database Wiring: Connect the Tab 1 Calendar and Tab 2 Passport inputs directly to the RxDB Users and Records collections, ensuring offline-first CRUD operations work locally.
AI Omni-Input & Copilot: Integrate the Vercel AI SDK and Gemini API. Build the AI extraction logic for Tab 1 (parsing text into the JSON Target Shape) and the RAG chat interface for Tab 3.



9. Future State: Cloud Architecture & Advanced AI
The MVP is strictly a local-first, single-user pilot. However, the foundational architecture must support a seamless transition to a secure, multi-user, cloud-connected production environment built on the following pillars:
Cloud Sync & Coach Portal: Utilizing the RxDB MongoDB Replication Plugin to perform real-time, two-way synchronization with MongoDB Atlas. This allows coaches to view athlete data on a remote web dashboard while keeping the athlete's mobile app offline-first.
Authentication (AuthN): Implementing secure, frictionless user identity management (e.g., Apple Sign-In, Google Sign-In) to verify who is using the application.
Authorization (AuthZ): Establishing strict Role-Based Access Control (RBAC) to ensure athletes can only view their own health logs, while verified coaches are granted permission to view data for multiple assigned athletes.
AI Working Memory: Injecting an always-updating, summarized profile of the athlete directly into the Gemini Copilot's system prompt to maintain highly personalized context across all interactions.
AI Semantic Memory: Transitioning from simple chat history to Vector-based Retrieval-Augmented Generation (RAG), allowing the AI to query months or years of accumulated RxDB health records to identify long-term physiological trends.
Application Observability: Integrating remote monitoring telemetry to track UI crash reports, application load times, and feature usage analytics.
AI Observability: Deploying specialized LLM monitoring to explicitly track Gemini API token consumption, prompt latency, and cost-per-query to ensure the AI integration remains economically viable at scale.

