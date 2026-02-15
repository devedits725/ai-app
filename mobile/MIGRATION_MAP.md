# React Web → React Native Migration Map

## Step 1 — Repository analysis (completed)

### Pages / routes → Screens
| Web route | React Native screen | File |
|-----------|---------------------|------|
| `/` | Home | `src/screens/HomeScreen.tsx` |
| `/calculator` | Calculator | `src/screens/CalculatorScreen.tsx` |
| `/formulas` | Formulas | `src/screens/FormulasScreen.tsx` |
| `/converter` | Converter | `src/screens/ConverterScreen.tsx` |
| `/flashcards` | Flashcards | `src/screens/FlashcardsScreen.tsx` |
| `/quiz` | Quiz | `src/screens/QuizScreen.tsx` |
| `/settings` | Settings | `src/screens/SettingsScreen.tsx` |
| `/ai-helper` | AIHelper | `src/screens/AIHelperScreen.tsx` |
| `/ai-flashcards` | AIFlashcards | `src/screens/AIFlashcardsScreen.tsx` |
| `/ai-quiz` | AIQuiz | `src/screens/AIQuizScreen.tsx` |
| `/ai-formula-search` | AIFormulaSearch | `src/screens/AIFormulaSearchScreen.tsx` |
| `*` (404) | NotFound | `src/screens/NotFoundScreen.tsx` |

### Components
| Web | Native | Notes |
|-----|--------|-------|
| `PageHeader` | `src/components/layout/PageHeader.tsx` | Back button → `navigation.goBack()` |
| `BannerAdPlaceholder` | `src/components/layout/BannerAdPlaceholder.tsx` | View + Text |
| `RewardedAdPlaceholder` | `src/components/layout/RewardedAdPlaceholder.tsx` | Modal |
| `InterstitialAdPlaceholder` | `src/components/layout/InterstitialAdPlaceholder.tsx` | Modal |
| `Tabs` (Radix) | `src/components/ui/Tabs.tsx` | State-based, no Radix |
| `Input` (shadcn) | `src/components/ui/Input.tsx` | TextInput + theme |
| BasicCalculator | `src/components/calculators/BasicCalculator.tsx` | StyleSheet grid |
| PercentageCalculator | `src/components/calculators/PercentageCalculator.tsx` | |
| DiscountCalculator | `src/components/calculators/DiscountCalculator.tsx` | |
| AgeCalculator | `src/components/calculators/AgeCalculator.tsx` | date-fns kept |
| ExamScoreCalculator | `src/components/calculators/ExamScoreCalculator.tsx` | |

### Shared utilities
| Web | Native |
|-----|--------|
| `src/lib/utils.ts` (cn) | Not needed (no Tailwind) |
| `src/lib/toast.ts` | New: Alert-based toast |
| `src/lib/storage.ts` | New: AsyncStorage wrapper |

### State management
- **Theme**: `ThemeContext` kept; `localStorage` → AsyncStorage; `document.documentElement` / `window.matchMedia` → `useColorScheme` + AsyncStorage.

### API / services
| Web | Native |
|-----|--------|
| `src/services/aiService.ts` | Same logic; `localStorage` → AsyncStorage; `navigator.onLine` → `@react-native-community/netinfo` |
| `src/integrations/supabase/client.ts` | Same; `localStorage` → AsyncStorage for auth |

### Storage
- **Keys preserved**: `app-theme`, `formula-bookmarks`, `flashcard-progress`, `ai-cache-*`, `ai-daily-counter`, `ai-flashcards-saved`.
- **Implementation**: All AsyncStorage (async APIs where needed).

### Environment
- Web: `import.meta.env.VITE_*`
- Native: `src/config/env.ts` from `Constants.expoConfig?.extra` and `process.env.EXPO_PUBLIC_*`

### Assets
- Icons: Replaced lucide-react with emoji / text where simple; no asset dependency.
- `assets/icon.png`, `splash-icon.png`, `adaptive-icon.png`: Minimal placeholder PNG for Expo.

### Navigation
- **Web**: `BrowserRouter`, `Routes`, `Route`, `Link`, `useNavigate`.
- **Native**: `@react-navigation/native` + `@react-navigation/native-stack`; `navigation.navigate(name)`, `navigation.goBack()`.

### Tailwind → Native styles
- All class names removed.
- `src/constants/theme.ts`: colors (light/dark), spacing, borderRadius, fontSize.
- Per-component `StyleSheet.create()` and theme `colors` from `useTheme()`.

### Ad integration
- Placeholder components and `src/hooks/useAds.ts` (useBannerAd, useInterstitialAd, useRewardedAd). No hardcoded ad IDs.

### Platform
- No `window` / `document` in app code.
- Clipboard: `expo-clipboard`.
- Share: `Share` from `react-native`.
- Linking: `Linking.openURL` for mailto.
