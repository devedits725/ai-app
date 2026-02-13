

# AI Student Pocket Toolkit — Implementation Plan

## Overview
A cross-platform mobile study app for school students with calculators, formula sheets, flashcards, quizzes, and AI-powered study tools. Built with React + Capacitor for native Android/iOS distribution. Clean, fast, offline-first, no login required.

---

## Phase 1: Foundation & Core UI

### 1. App Shell & Theming
- Dark/light theme toggle with system preference detection
- Clean, mobile-optimized Material-inspired design using Tailwind
- Bottom navigation or grid-based home dashboard
- Modular page routing

### 2. Home Screen Dashboard
- Grid of 9 rounded cards with icons, titles, and subtitles:
  - Calculator Tools, Formula Sheets, Unit Converter, Flashcards, Practice Quiz, AI Homework Helper, AI Flashcard Generator, AI Quiz Generator, Smart Formula Search
- Tap animations on each card
- AI-powered cards visually distinguished with a badge/icon

### 3. Settings Screen
- Dark/light mode toggle
- Share app button
- Rate app placeholder
- Feedback email link
- Remove ads placeholder

---

## Phase 2: Offline Study Tools

### 4. Calculator Module
- 5 calculator tools: Basic (with history), Percentage, Discount, Age, Exam Score
- Tab or list navigation between calculators
- All fully offline

### 5. Formula Sheets Module
- Tabs by subject: Math, Physics, Chemistry with subtopics
- Search bar to filter formulas
- Bookmark and copy formula functionality
- Data loaded from local JSON datasets
- Fully offline

### 6. Unit Converter Module
- 7 converters: Length, Weight, Temperature, Speed, Area, Volume, Data Size
- Real-time conversion while typing
- Fully offline

### 7. Flashcards Module
- Category-based flashcard sets from local JSON
- Flip card animation
- Mark known/unknown, shuffle mode
- Progress stored in localStorage
- Premium sets concept (gated behind placeholder rewarded ad)

### 8. Practice Quiz Module
- 10 MCQ questions per test from local JSON
- Score summary with explanations after each answer
- Retry functionality

---

## Phase 3: AI-Powered Features (Lovable AI)

### 9. AI Service Layer
- Backend edge function connecting to Lovable AI gateway
- Functions: explainQuestion, generateFlashcards, generateQuiz, smartSearchFormula
- Response caching by hashed prompt (localStorage)
- Daily usage counter (stored locally, resets daily)
- 15-second timeout, debounced submit, max response size handling
- Offline detection: show cached data or "no internet" message

### 10. AI Homework Helper
- Text input → AI returns step-by-step explanation
- Loading indicator, result card with copy button
- Cached responses for repeated queries

### 11. AI Flashcard Generator
- User enters topic → AI generates 8 structured flashcards
- Saved locally for offline reuse
- Rewarded ad placeholder before generation

### 12. AI Quiz Generator
- Topic input → AI generates 5 MCQs with options and explanations
- Cached results for offline replay

### 13. Smart Formula Search
- Natural language query → AI returns matching formula with variable explanation
- Cached results

---

## Phase 4: Monetization & Polish

### 14. Ad Service Skeleton
- Banner ad placeholders at bottom of tool screens
- Interstitial ad placeholders (after quiz, formula tab switch, repeated tool usage)
- Rewarded ad placeholders (before AI calls, premium flashcard unlock)
- Test ad UI components (visual placeholders you can later replace with real AdMob via Capacitor plugin)

### 15. AI Cost Control System
- Daily call counter per feature (stored in localStorage)
- Prompt hash-based caching to avoid duplicate API calls
- Show cached result if exists before making new call
- Visual indicator of remaining daily AI uses

---

## Phase 5: Mobile Packaging

### 16. Capacitor Setup
- Configure Capacitor for iOS and Android builds
- App ID and name configuration
- Instructions for building and running on physical devices/emulators via Xcode and Android Studio

---

## Sample Data
- JSON datasets for: Math/Physics/Chemistry formulas, flashcard sets (5+ categories), quiz question banks (multiple subjects)
- All bundled with the app for offline access

## Performance
- Lazy-loaded routes for each module
- Minimal dependencies, light animations
- Optimized for low-end devices with small bundle size

