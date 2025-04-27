import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuth = async () => {
    if (user) {
      await supabase.auth.signOut();
      navigate("/auth");
    } else {
      navigate("/auth", { state: { smooth: true } });
    }
  };

  return (
    <header className="border-b border-slate-200 w-full py-4 px-4 md:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <nav className="hidden md:flex space-x-8 items-center">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-gray-600 hover:text-brand-600 transition-colors duration-300 relative after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
          >
            Funcionalidades
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-gray-600 hover:text-brand-600 transition-colors duration-300 relative after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
          >
            Como Funciona
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-gray-600 hover:text-brand-600 transition-colors duration-300 relative after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-brand-600 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
          >
            Preços
          </button>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <Button 
              variant="ghost" 
              onClick={handleAuth}
              className="flex items-center space-x-2 transition-all duration-300 hover:bg-brand-100"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={handleAuth}
                className="hidden md:inline-flex transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Entrar
              </Button>
              <Button 
                onClick={handleAuth}
                className="bg-brand-600 hover:bg-brand-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Testar Grátis
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
