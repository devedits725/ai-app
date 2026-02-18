import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdsProvider } from "@/contexts/AdsContext";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const CalculatorPage = lazy(() => import("./pages/CalculatorPage"));
const FormulasPage = lazy(() => import("./pages/FormulasPage"));
const ConverterPage = lazy(() => import("./pages/ConverterPage"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AIHelperPage = lazy(() => import("./pages/AIHelperPage"));
const AIFlashcardsPage = lazy(() => import("./pages/AIFlashcardsPage"));
const AIQuizPage = lazy(() => import("./pages/AIQuizPage"));
const AIFormulaSearchPage = lazy(() => import("./pages/AIFormulaSearchPage"));
const CreditsPage = lazy(() => import("./pages/CreditsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AdsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/calculator" element={<CalculatorPage />} />
                <Route path="/formulas" element={<FormulasPage />} />
                <Route path="/converter" element={<ConverterPage />} />
                <Route path="/flashcards" element={<FlashcardsPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/ai-helper" element={<AIHelperPage />} />
                <Route path="/ai-flashcards" element={<AIFlashcardsPage />} />
                <Route path="/ai-quiz" element={<AIQuizPage />} />
                <Route path="/ai-formula-search" element={<AIFormulaSearchPage />} />
                <Route path="/credits" element={<CreditsPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AdsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
