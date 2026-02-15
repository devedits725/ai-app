import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Calculator: undefined;
  Formulas: undefined;
  Converter: undefined;
  Flashcards: undefined;
  Quiz: undefined;
  Settings: undefined;
  AIHelper: undefined;
  AIFlashcards: undefined;
  AIQuiz: undefined;
  AIFormulaSearch: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
