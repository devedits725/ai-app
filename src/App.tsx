import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AdsProvider } from "@/contexts/AdsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import BannerAdPlaceholder from "@/components/layout/BannerAdPlaceholder";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const ProfileSetupPage = lazy(() => import("./pages/ProfileSetupPage"));
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
      <AuthProvider>
        <AdsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <div className="flex flex-col min-h-screen relative">
                  <div className="flex-1">
                    <Routes>
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />

                      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                      <Route path="/calculator" element={<ProtectedRoute><CalculatorPage /></ProtectedRoute>} />
                      <Route path="/formulas" element={<ProtectedRoute><FormulasPage /></ProtectedRoute>} />
                      <Route path="/converter" element={<ProtectedRoute><ConverterPage /></ProtectedRoute>} />
                      <Route path="/flashcards" element={<ProtectedRoute><FlashcardsPage /></ProtectedRoute>} />
                      <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                      <Route path="/ai-helper" element={<ProtectedRoute><AIHelperPage /></ProtectedRoute>} />
                      <Route path="/ai-flashcards" element={<ProtectedRoute><AIFlashcardsPage /></ProtectedRoute>} />
                      <Route path="/ai-quiz" element={<ProtectedRoute><AIQuizPage /></ProtectedRoute>} />
                      <Route path="/ai-formula-search" element={<ProtectedRoute><AIFormulaSearchPage /></ProtectedRoute>} />
                      <Route path="/credits" element={<ProtectedRoute><CreditsPage /></ProtectedRoute>} />
                      <Route path="/privacy" element={<ProtectedRoute><PrivacyPolicyPage /></ProtectedRoute>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <BannerAdPlaceholder />
                </div>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AdsProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
