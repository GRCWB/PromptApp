
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Creator from "./pages/Creator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const NavigationHandler = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      // Only redirect if user is trying to access /creator without being logged in
      if (!data.session && (location.pathname === "/creator" || location.pathname.startsWith("/editor/"))) {
        navigate("/auth", { replace: true });
      }
      setIsChecking(false);
    };
    
    checkSession();

    // Monitor auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && location.pathname === "/auth") {
        navigate("/creator", { replace: true });
      } else if (event === "SIGNED_OUT" && (location.pathname === "/creator" || location.pathname.startsWith("/editor/"))) {
        navigate("/", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  // Show loading state while checking auth only for protected routes
  if (isChecking && (location.pathname === "/creator" || location.pathname.startsWith("/editor/"))) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-brand-600">Carregando...</div>
    </div>;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NavigationHandler>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/editor/:id" element={<Creator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NavigationHandler>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
