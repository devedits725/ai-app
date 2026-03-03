# Student Toolkit — React Native (Expo)

Mobile app migrated from the React + Tailwind web app. All features, navigation, and business logic are preserved.

## Requirements

- Node.js 18+
- npm or yarn
- Expo Go app on your device (for development), or Android Studio / Xcode for builds

## Setup

```bash
cd mobile
npm install
```

## Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

- `EXPO_PUBLIC_SUPABASE_URL` — Supabase project URL (from [Supabase Dashboard](https://supabase.com/dashboard) → your project → Settings → API)
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon (public) key

Or set them in `app.json` under `"extra"` (same keys or `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`). Restart the dev server after changing env.

## AI integration

AI features (Homework Helper, AI Flashcards, AI Quiz, Smart Formula Search) call a Supabase Edge Function `ai-study`. To enable them:

1. **Use the same Supabase project as the web app** (or create one at [supabase.com](https://supabase.com)).
2. **Deploy the Edge Function** from the repo root:
   ```bash
   cd ..   # project root
   npx supabase functions deploy ai-study
   ```
3. **Set the function secret** (Lovable AI gateway key):
   ```bash
   npx supabase secrets set LOVABLE_API_KEY=your-lovable-api-key
   ```
   Get the key from your [Lovable](https://lovable.dev) account if the web app already uses it.
4. **Set mobile env** as above: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` for that project.

Without these, the app still runs; AI screens will show “Supabase not configured” when you try to use them.

## Disable ads for a while

In the app: **Settings** → **Disable ads for 7 days**. All ad placeholders (banner, rewarded, interstitial) are hidden for 7 days. Tap **Ads off until …** to re-enable ads anytime.

## Run

```bash
npm start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS).

- Android: `npm run android`
- iOS: `npm run ios`

## Features (preserved from web)

- **Home** — Module grid (Calculator, Formulas, Converter, Flashcards, Quiz, Settings, AI features)
- **Calculator** — Basic, %, Discount, Age, Exam score
- **Formulas** — Math / Physics / Chemistry with search and bookmarks
- **Converter** — Length, weight, temp, speed, area, volume, data
- **Flashcards** — Categories, flip, known/unknown, shuffle
- **Quiz** — Math/Science, score, explanations
- **Settings** — Theme (light/dark), Share, Rate, Feedback, Disable ads for 7 days
- **AI Helper** — Homework Q&A (Supabase Edge Function)
- **AI Flashcards** — Generate from topic
- **AI Quiz** — Generate MCQ from topic
- **AI Formula Search** — Plain-language formula search

Storage uses AsyncStorage (replacing localStorage). AI service uses Supabase + AsyncStorage for cache and daily limit. Ad placeholders (banner, rewarded, interstitial) are in place; hook up your ad SDK in `src/hooks/useAds.ts` and replace placeholders when ready.

## Project structure

- `App.tsx` — Root with ThemeProvider, NavigationContainer, stack navigator
- `src/screens/` — All screens (Home, Calculator, Formulas, …)
- `src/components/` — layout (PageHeader, ad placeholders), ui (Tabs, Input), calculators
- `src/contexts/ThemeContext.tsx` — Theme + AsyncStorage
- `src/services/aiService.ts` — AI API, cache, daily limit
- `src/integrations/supabase/` — Supabase client (AsyncStorage for auth)
- `src/data/` — formulas.json, flashcards.json, quizzes.json
- `src/constants/theme.ts` — Colors and spacing
- `src/hooks/useAds.ts` — Ad integration hooks (placeholders)

No DOM, no Tailwind; all styles are StyleSheet / theme-based.
