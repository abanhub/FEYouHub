import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { SafeModeProvider } from "@/shared/lib/contexts/SafeModeContext";
import { LanguageProvider } from "@/shared/lib/contexts/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

export const AppProviders = ({ children }: PropsWithChildren): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SafeModeProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          {children}
        </LanguageProvider>
      </SafeModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
