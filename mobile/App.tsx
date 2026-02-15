import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { AdsProvider } from '@/contexts/AdsContext';
import type { RootStackParamList } from '@/types/navigation';

import HomeScreen from '@/screens/HomeScreen';
import CalculatorScreen from '@/screens/CalculatorScreen';
import FormulasScreen from '@/screens/FormulasScreen';
import ConverterScreen from '@/screens/ConverterScreen';
import FlashcardsScreen from '@/screens/FlashcardsScreen';
import QuizScreen from '@/screens/QuizScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AIHelperScreen from '@/screens/AIHelperScreen';
import AIFlashcardsScreen from '@/screens/AIFlashcardsScreen';
import AIQuizScreen from '@/screens/AIQuizScreen';
import AIFormulaSearchScreen from '@/screens/AIFormulaSearchScreen';
import NotFoundScreen from '@/screens/NotFoundScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? 'hsl(224, 30%, 8%)' : 'hsl(210, 20%, 98%)' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Calculator" component={CalculatorScreen} />
      <Stack.Screen name="Formulas" component={FormulasScreen} />
      <Stack.Screen name="Converter" component={ConverterScreen} />
      <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AIHelper" component={AIHelperScreen} />
      <Stack.Screen name="AIFlashcards" component={AIFlashcardsScreen} />
      <Stack.Screen name="AIQuiz" component={AIQuizScreen} />
      <Stack.Screen name="AIFormulaSearch" component={AIFormulaSearchScreen} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AdsProvider>
            <StatusBar style="auto" />
            <NavigationContainer>
              <StackNavigator />
            </NavigationContainer>
          </AdsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
