
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedContent {
  siteName: string;
  heroSection: {
    headline: string;
    description: string;
  };
  about: string;
  cta: string[];
}

interface ContentGeneratorProps {
  onContentGenerated: (content: GeneratedContent) => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ onContentGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async (type: keyof GeneratedContent, prompt: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-website-content', {
        body: { 
          prompt, 
          type,
          useAdvancedModel: true // Enable more powerful model
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt vazio",
        description: "Por favor, descreva seu negócio ou projeto",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate all content concurrently for faster response
      const [siteNameResult, heroSectionResult, aboutResult, ctaResult] = await Promise.allSettled([
        generateContent('siteName', prompt),
        generateContent('heroSection', prompt),
        generateContent('about', prompt),
        generateContent('cta', prompt)
      ]);
      
      // Extract the content, handling any rejected promises with fallbacks
      const content: GeneratedContent = {
        siteName: siteNameResult.status === 'fulfilled' ? siteNameResult.value : 'Meu Site',
        heroSection: heroSectionResult.status === 'fulfilled' ? heroSectionResult.value : {
          headline: 'Bem-vindo ao nosso site',
          description: 'Um site criado especialmente para você'
        },
        about: aboutResult.status === 'fulfilled' ? aboutResult.value : 'Sobre nós',
        cta: ctaResult.status === 'fulfilled' ? ctaResult.value : ['Entre em contato'],
      };

      onContentGenerated(content);

      toast({
        title: "Conteúdo gerado!",
        description: "O conteúdo do seu site foi gerado com sucesso.",
      });
    } catch (error) {
      console.error("Erro na geração de conteúdo:", error);
      toast({
        title: "Erro ao gerar conteúdo",
        description: "Ocorreu um erro ao gerar o conteúdo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold">Gerar Conteúdo do Site</h2>
      <p className="text-sm text-gray-600">
        Descreva seu negócio ou projeto e deixe nossa IA gerar o conteúdo para você.
      </p>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ex: Uma barbearia moderna em São Paulo especializada em cortes clássicos e contemporâneos..."
        className="min-h-[100px]"
      />

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando conteúdo...
          </>
        ) : (
          'Gerar Conteúdo'
        )}
      </Button>
    </div>
  );
};

export default ContentGenerator;
