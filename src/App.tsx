// Use relative imports here to avoid alias flakiness in dev
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SafeModeProvider } from "@/context/SafeModeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { lazy, Suspense } from "react";
import SearchPage from "./pages/Search";

const Index = lazy(() => import("@/pages/Home"));
const DemoView = lazy(() => import("@/pages/DemoView"));

const NotFound = lazy(() => import("@/pages/NotFound"));
const Channel = lazy(() => import("@/pages/Channel"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Avoid noisy refetches and duplicate calls across the app
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SafeModeProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/v/:id" element={<DemoView />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/c/:id" element={<Channel/>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </SafeModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
