import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowRight, Bot, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(3);
  const [hasCheckedCredits, setHasCheckedCredits] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCredits = async () => {
      if (user && !hasCheckedCredits) {
        try {
          // Here you would fetch the user's credits from the database
          // For now, we'll use a mock value of 3
          setCredits(3);
          setHasCheckedCredits(true);
        } catch (error) {
          console.error("Error fetching credits:", error);
        }
      }
    };

    fetchCredits();
  }, [user, hasCheckedCredits]);

  const handleTryFree = () => {
    navigate("/auth", { state: { signup: true } });
  };

  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleGenerateWebsite = async () => {
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    if (credits <= 0) {
      toast({
        title: "Créditos esgotados",
        description: "Você precisa adquirir um plano para continuar gerando sites",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt vazio",
        description: "Por favor, insira uma descrição do site que deseja criar",
        variant: "destructive",
      });
      return;
    }

    // Redirect to creator page with the prompt
    navigate("/creator");
  };

  return (
    <section className="py-20 px-4 bg-hero-pattern relative overflow-hidden">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full border border-brand-200 bg-white text-brand-700 shadow-sm animate-fade-in">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>A revolução no desenvolvimento de sites</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
            <span className="gradient-text">Seu site pronto</span> com um único prompt
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 md:text-2xl animate-fade-in">
            Crie sites e aplicativos completos a partir de uma simples descrição em linguagem natural, sem precisar escrever uma linha de código.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {!user && (
              <Button 
                className="bg-brand-600 hover:bg-brand-700 text-lg h-12 px-8 rounded-lg w-full sm:w-auto transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in"
                onClick={handleTryFree}
              >
                Testar Grátis por 7 Dias
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {user && (
              <Button
                className="bg-brand-600 hover:bg-brand-700 text-lg h-12 px-8 rounded-lg w-full sm:w-auto transition-all duration-300 transform hover:scale-105 active:scale-95 animate-fade-in"
                onClick={() => navigate("/creator")}
              >
                Criar Novo Site
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
          
          <div className="relative mx-auto max-w-4xl rounded-xl bg-white p-2 shadow-2xl shadow-gray-900/10 border border-gray-200 animate-scale-in">
            <div className="rounded-lg bg-gray-800 p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-gray-400">promptsites.com.br</span>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 text-left mb-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Descreva o site que você quer criar. Ex: Crie um site para minha loja de roupas com uma galeria de produtos e um formulário de contato."
                  className="bg-gray-700 border-gray-600 text-green-400 font-mono placeholder:text-gray-500 text-sm md:text-base focus:ring-brand-500 focus:border-brand-500 transition-all duration-300 hover:border-brand-400 min-h-[80px]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="h-5 w-5 text-brand-400 mr-2" />
                  <p className="text-xs md:text-sm text-gray-300 font-mono">
                    {isGenerating ? "Gerando seu site completo..." : "Aguardando seu prompt..."}
                  </p>
                </div>
                
                <Button
                  onClick={handleGenerateWebsite}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-sm px-4 py-2 rounded transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando
                    </>
                  ) : (
                    <>
                      Gerar Site
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[425px] animate-scale-in">
          <DialogHeader>
            <DialogTitle>Login Necessário</DialogTitle>
            <DialogDescription>
              Para gerar um site, você precisa criar uma conta ou fazer login.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                setShowLoginDialog(false);
                navigate("/auth");
              }}
              className="bg-brand-600 hover:bg-brand-700"
            >
              Fazer Login / Cadastrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
