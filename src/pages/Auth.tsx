
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Lock, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/Logo";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/", { replace: true });
      }
    };
    
    checkUser();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Email já cadastrado",
              description: "Este email já está sendo utilizado. Por favor, faça login ou use outro email.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Conta criada com sucesso!",
            description: "Verifique seu email para confirmar o cadastro.",
          });
          navigate("/");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth?reset=true",
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-brand-600/5 to-purple-600/5 p-4 overflow-auto">
      <motion.div 
        className="relative w-full max-w-md space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.button
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="h-6 w-6" />
        </motion.button>

        <div className="flex justify-center mb-4">
          <Logo size="large" showText={false} />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isSignUp ? "Crie sua conta!" : "Acesse sua conta"}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {!isResetPassword ? (
            <motion.div
              key="auth-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-brand-500 shadow-sm hover:shadow"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-brand-500 shadow-sm hover:shadow"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full bg-brand-600 hover:bg-brand-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isSignUp ? "Criar conta" : "Entrar"}
                </Button>
              </form>

              <div className="mt-4 text-center space-y-2">
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => setIsResetPassword(true)}
                    className="text-sm text-brand-600 hover:text-brand-800 transition-colors duration-300"
                  >
                    Esqueceu sua senha?
                  </button>
                )}
                <div>
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm text-brand-600 hover:text-brand-800 transition-all duration-300 ease-in-out relative after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                  >
                    {isSignUp
                      ? "Já tem uma conta? Entre aqui"
                      : "Não tem uma conta? Cadastre-se"}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="reset-form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold">Recuperar senha</h2>
                <p className="mt-2 text-gray-600">
                  {resetSent 
                    ? "Verifique seu email para redefinir sua senha"
                    : "Digite seu email para receber o link de recuperação"}
                </p>
              </div>

              {!resetSent && (
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-brand-500 shadow-sm hover:shadow"
                    />
                  </div>

                  <Button 
                    className="w-full bg-brand-600 hover:bg-brand-700 transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Enviar email de recuperação
                  </Button>
                </form>
              )}

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsResetPassword(false)}
                  className="text-sm text-brand-600 hover:text-brand-800 transition-all duration-300 ease-in-out relative after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
                >
                  Voltar para o login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;
