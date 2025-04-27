
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ThemeOption {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  styles: {
    mainColor: string;
    fontFamily: string;
    buttonStyle: string;
    layoutType: string;
  };
}

const defaultThemes: ThemeOption[] = [
  {
    id: "modern",
    name: "Moderno",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=60",
    description: "Design limpo e moderno com tons suaves",
    styles: {
      mainColor: "#3B82F6",
      fontFamily: "Inter, sans-serif",
      buttonStyle: "rounded-lg",
      layoutType: "modern"
    }
  },
  {
    id: "minimalist",
    name: "Minimalista",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=60",
    description: "Layout minimalista com foco no conteúdo",
    styles: {
      mainColor: "#111827",
      fontFamily: "system-ui, sans-serif",
      buttonStyle: "rounded-none",
      layoutType: "minimal"
    }
  },
  {
    id: "creative",
    name: "Criativo",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=500&q=60",
    description: "Design vibrante e criativo",
    styles: {
      mainColor: "#8B5CF6",
      fontFamily: "Poppins, sans-serif",
      buttonStyle: "rounded-full",
      layoutType: "creative"
    }
  }
];

interface ThemeSelectorProps {
  themes?: ThemeOption[];
  onSelectTheme: (theme: ThemeOption) => void;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes = defaultThemes,
  onSelectTheme,
  onClose
}) => {
  const { toast } = useToast();
  
  const handleThemeSelect = (theme: ThemeOption) => {
    onSelectTheme(theme);
    toast({
      title: "Tema selecionado",
      description: `O tema ${theme.name} foi aplicado com sucesso.`,
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Escolha um tema</h2>
          <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">×</Button>
        </div>
        
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div 
              key={theme.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
              onClick={() => handleThemeSelect(theme)}
            >
              <div className="aspect-video relative">
                <img 
                  src={theme.thumbnail} 
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-3 left-3 text-white font-medium text-lg">{theme.name}</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">{theme.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {theme.styles.layoutType}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {theme.styles.fontFamily.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
