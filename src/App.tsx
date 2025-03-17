
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Emergency from "./pages/Emergency";
import SafeRoutes from "./pages/SafeRoutes";
import Contacts from "./pages/Contacts";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  // Preload any necessary resources or set global state
  useEffect(() => {
    console.log("WomenWise Safety Application Initialized");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/safe-routes" element={<SafeRoutes />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/resources" element={<Resources />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
