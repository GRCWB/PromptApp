
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Bot, 
  Loader2, 
  Send, 
  CreditCard, 
  Download, 
  Share2, 
  ChevronRight, 
  Sparkles,
  History,
  LayoutDashboard,
  Palette,
  Save
} from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { 
  Message, 
  HistoryAction, 
  generateHtmlFromPrompt, 
  updateHtmlBasedOnMessage,
  getTemplateSuggestions,
  getAvailableThemes,
  ThemeStyles
} from "@/utils/editorUtils";
import EditorToolbar from "@/components/editor/EditorToolbar";
import ChatPanel from "@/components/editor/ChatPanel";
import HistoryPanel from "@/components/editor/HistoryPanel";
import ThemeSelector from "@/components/editor/ThemeSelector";
import ContentGenerator from "@/components/ContentGenerator";
import Logo from "@/components/Logo";

interface GeneratedContent {
  siteName: string;
  heroSection: {
    headline: string;
    description: string;
  };
  about: string;
  cta: string[];
}

interface SaveProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, description: string) => void;
  initialTitle: string;
  initialDescription: string;
}

const SaveProjectDialog = ({ 
  open, 
  onOpenChange, 
  onSave, 
  initialTitle,
  initialDescription 
}: SaveProjectDialogProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    if (open) {
      setTitle(initialTitle);
      setDescription(initialDescription);
    }
  }, [open, initialTitle, initialDescription]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Salvar Projeto</DialogTitle>
          <DialogDescription>
            Dê um título e uma descrição para o seu projeto.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Título</label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Meu site incrível"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Descrição</label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uma breve descrição do seu projeto"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => {
            if (title.trim()) {
              onSave(title, description);
            }
          }}>
            Salvar Projeto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Creator = () => {
  // State for editor
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [credits, setCredits] = useState(3);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [iframeContent, setIframeContent] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [currentThemeStyles, setCurrentThemeStyles] = useState<ThemeStyles | null>(null);

  // Project saving
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectTitle, setProjectTitle] = useState("Novo Projeto");
  const [projectDescription, setProjectDescription] = useState("");
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // History management
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  // Side panels
  const [showColorPalette, setShowColorPalette] = useState(false);
  const [showComponents, setShowComponents] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: projectId } = useParams();

  const availableThemes = getAvailableThemes();

  const suggestedPrompts = [
    "Mude a cor do site para verde",
    "Adicione uma seção com depoimentos",
    "Insira um botão de WhatsApp",
    "Crie uma galeria de imagens",
    "Adicione uma seção de serviços",
    "Mude a fonte dos títulos para Georgia",
    "Adicione um banner de promoção",
    "Crie uma seção de perguntas frequentes"
  ];

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUser(data.session.user);
    };

    checkUser();
  }, [navigate]);

  // Load project if ID is provided
  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        try {
          const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setCurrentProjectId(data.id);
            setProjectTitle(data.title);
            setProjectDescription(data.description || "");
            
            // Load the project content
            // This is a placeholder - in a real app, you would load the actual project content
            // For now, we'll just generate some placeholder content
            const generatedHtml = generateHtmlFromPrompt(data.title);
            setIframeContent(generatedHtml);
            
            // Add to history
            addToHistory("Projeto carregado", generatedHtml);
            
            toast({
              title: "Projeto carregado",
              description: `O projeto "${data.title}" foi carregado com sucesso.`,
            });
          }
        } catch (error: any) {
          console.error("Erro ao carregar projeto:", error);
          toast({
            title: "Erro ao carregar projeto",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };
    
    loadProject();
  }, [projectId]);

  // Add version to history
  const addToHistory = (description: string, htmlContent: string) => {
    const newAction: HistoryAction = {
      id: uuidv4(),
      timestamp: new Date(),
      description,
      htmlContent
    };
    
    // If we're not at the most recent history item, remove all future items
    if (currentHistoryIndex !== history.length - 1 && history.length > 0) {
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      setHistory([...newHistory, newAction]);
    } else {
      setHistory([...history, newAction]);
    }
    
    setCurrentHistoryIndex(history.length);
  };

  // Handle undo/redo
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      setIframeContent(history[newIndex].htmlContent);
      
      toast({
        title: "Alteração desfeita",
        description: `Revertido para: ${history[newIndex].description}`,
      });
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      setIframeContent(history[newIndex].htmlContent);
      
      toast({
        title: "Alteração refeita",
        description: `Avançado para: ${history[newIndex].description}`,
      });
    }
  };
  
  const handleRestoreVersion = (index: number) => {
    setCurrentHistoryIndex(index);
    setIframeContent(history[index].htmlContent);
    
    toast({
      title: "Versão restaurada",
      description: `Restaurado para: ${history[index].description}`,
    });
  };
  
  const handleDeleteVersion = (id: string) => {
    const index = history.findIndex(item => item.id === id);
    
    if (index === -1) return;
    
    const newHistory = [...history];
    newHistory.splice(index, 1);
    
    setHistory(newHistory);
    
    // Adjust current index if needed
    if (currentHistoryIndex >= index && currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    } else if (newHistory.length === 0) {
      setCurrentHistoryIndex(-1);
    }
    
    toast({
      title: "Versão removida",
      description: "A versão foi removida do histórico.",
    });
  };

  const generateWebsite = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt vazio",
        description: "Por favor, insira uma descrição do site que você deseja criar",
        variant: "destructive",
      });
      return;
    }

    if (credits <= 0) {
      setShowPlansModal(true);
      return;
    }

    setIsGenerating(true);
    
    try {
      // Add user message to chat
      const userMessageId = uuidv4();
      const userMessage = {
        id: userMessageId,
        role: "user" as const,
        content: prompt
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate generation (would be an API call in production)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Generate HTML based on the prompt
      const generatedHtml = generateHtmlFromPrompt(prompt);
      setIframeContent(generatedHtml);
      
      // Add assistant response to chat
      const assistantMessage = {
        id: uuidv4(),
        role: "assistant" as const,
        content: "Site gerado com sucesso! O que você gostaria de modificar?"
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Add to history
      addToHistory("Site inicial gerado", generatedHtml);
      
      // Update credits
      setCredits(prev => prev - 1);
      
      // Open chat if it's not already open
      setIsChatOpen(true);
      
      toast({
        title: "Site gerado com sucesso!",
        description: "Seu site foi criado de acordo com seu prompt.",
      });

      // Show save dialog
      setShowSaveDialog(true);
    } catch (error) {
      console.error("Erro ao gerar site:", error);
      toast({
        title: "Erro ao gerar site",
        description: "Ocorreu um erro ao processar seu prompt. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  const saveProject = async (title: string, description: string) => {
    if (!user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para salvar seu projeto",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!iframeContent) {
      toast({
        title: "Nenhum site gerado",
        description: "Gere um site antes de salvar",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const projectData = {
        title,
        description,
        user_id: user.id,
        last_edited: new Date().toISOString(),
        // In a real application, you would also save the HTML content to a database
        // or file storage system. For this example, we'll omit that part.
      };

      let result;

      if (currentProjectId) {
        // Update existing project
        const { data, error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', currentProjectId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        toast({
          title: "Projeto atualizado",
          description: "Seu projeto foi atualizado com sucesso!",
        });
      } else {
        // Create new project
        const { data, error } = await supabase
          .from('projects')
          .insert(projectData)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        // Update current project ID
        setCurrentProjectId(result.id);
        
        toast({
          title: "Projeto salvo",
          description: "Seu projeto foi salvo com sucesso!",
        });
      }

      // Update project title and description
      setProjectTitle(title);
      setProjectDescription(description);
      
      // Close the save dialog
      setShowSaveDialog(false);
    } catch (error: any) {
      console.error("Erro ao salvar projeto:", error);
      toast({
        title: "Erro ao salvar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const sendChatMessage = async (message: string) => {
    if (!message.trim()) return;
    
    if (credits <= 0) {
      setShowPlansModal(true);
      return;
    }
    
    // Add user message to chat
    const userMessageId = uuidv4();
    const userMessage = {
      id: userMessageId,
      role: "user" as const,
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsProcessingMessage(true);
    
    try {
      // Atualizar o site com base na mensagem
      if (iframeContent) {
        console.log("Aplicando alterações ao site com base na mensagem:", message);
        
        // Adicionar mensagem temporária de processamento
        const processingMessageId = uuidv4();
        const processingMessage = {
          id: processingMessageId,
          role: "assistant" as const,
          content: "Processando sua solicitação..."
        };
        
        setMessages(prev => [...prev, processingMessage]);
        
        // Simular processamento da IA
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Atualizar o HTML
        const updatedHtml = updateHtmlBasedOnMessage(iframeContent, message);
        
        // Remover mensagem de processamento
        setMessages(prev => prev.filter(msg => msg.id !== processingMessageId));
        
        // Verificar se houve alterações no HTML
        if (updatedHtml !== iframeContent) {
          setIframeContent(updatedHtml);
          
          // Adicionar ao histórico
          addToHistory(`Alteração: ${message.slice(0, 30)}${message.length > 30 ? '...' : ''}`, updatedHtml);
          
          // Adicionar resposta do assistente ao chat
          const assistantMessage = {
            id: uuidv4(),
            role: "assistant" as const,
            content: "Alterações aplicadas! O que mais você gostaria de modificar?"
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          
          // Atualizar créditos
          setCredits(prev => prev - 1);
          
          toast({
            title: "Alterações aplicadas!",
            description: "Seu site foi atualizado com sucesso.",
          });
        } else {
          // Se não houve alterações, informar ao usuário
          const assistantMessage = {
            id: uuidv4(),
            role: "assistant" as const,
            content: "Não foi possível aplicar as alterações solicitadas. Tente descrever de outra forma ou solicitar outra modificação.",
            error: true
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          
          toast({
            title: "Sem alterações",
            description: "Não foi possível aplicar as alterações solicitadas. Tente outra modificação.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar o site:", error);
      
      // Adicionar mensagem de erro ao chat
      const assistantMessage = {
        id: uuidv4(),
        role: "assistant" as const,
        content: "Ocorreu um erro ao aplicar as alterações. Por favor, tente novamente com outra descrição.",
        error: true
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Erro ao aplicar alterações",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingMessage(false);
    }
  };

  const exportCode = () => {
    if (!iframeContent) {
      toast({
        title: "Nenhum site gerado",
        description: "Gere um site antes de exportar o código.",
        variant: "destructive",
      });
      return;
    }

    // Create a Blob with the HTML content
    const blob = new Blob([iframeContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement("a");
    a.href = url;
    a.download = "meu-site.html";
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Código exportado!",
      description: "O arquivo HTML do seu site foi baixado.",
    });
  };

  const publishSite = () => {
    if (!iframeContent) {
      toast({
        title: "Nenhum site gerado",
        description: "Gere um site antes de publicar.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate publishing
    toast({
      title: "Site publicado!",
      description: "Seu site está disponível em: meusite.promptsites.com.br",
    });
  };

  const [chatInput, setChatInput] = useState("");

  const handleSuggestedPromptClick = (promptText: string) => {
    sendChatMessage(promptText);
  };

  const applyTheme = (theme: any) => {
    if (!iframeContent) {
      toast({
        title: "Nenhum site gerado",
        description: "Gere um site antes de aplicar um tema.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Aplicando tema:", theme);
      
      // Atualizar o HTML com o tema selecionado
      let updatedHtml;
      
      if (theme.styles) {
        // Extrair o conteúdo personalizado do site atual (se houver)
        const titleMatch = iframeContent.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : "Meu Site";
        
        const contentRegex = /<div class="container">([\s\S]*?)<div class="footer">/;
        const contentMatch = iframeContent.match(contentRegex);
        const existingContent = contentMatch ? contentMatch[1] : null;
        
        // Gerar novo HTML com o mesmo conteúdo mas novo tema
        updatedHtml = generateHtmlFromPrompt(prompt, null, theme.styles);
        setCurrentThemeStyles(theme.styles);
      } else {
        toast({
          title: "Erro ao aplicar tema",
          description: "O tema selecionado não possui estilos definidos.",
          variant: "destructive",
        });
        return;
      }
      
      // Atualizar o iframe
      setIframeContent(updatedHtml);
      
      // Adicionar ao histórico
      addToHistory(`Tema aplicado: ${theme.name}`, updatedHtml);
      
      toast({
        title: "Tema aplicado!",
        description: `O tema ${theme.name} foi aplicado com sucesso.`,
      });
      
      setShowThemeSelector(false);
    } catch (error) {
      console.error("Erro ao aplicar tema:", error);
      toast({
        title: "Erro ao aplicar tema",
        description: "Ocorreu um erro ao aplicar o tema selecionado.",
        variant: "destructive",
      });
    }
  };

  const handleContentGenerated = (content: GeneratedContent) => {
    // Criar o HTML do site com base no conteúdo gerado
    const updatedHtml = generateHtmlFromPrompt(prompt, content);
    setIframeContent(updatedHtml);
    
    // Add to history
    addToHistory("Conteúdo inicial gerado via IA", updatedHtml);
    
    // Update messages
    const assistantMessage = {
      id: uuidv4(),
      role: "assistant" as const,
      content: "Conteúdo gerado com sucesso! O que você gostaria de modificar?"
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    // Open chat if it's not already open
    setIsChatOpen(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Logo size="small" />
          <span className="text-xl font-semibold text-gray-800">PromptApp</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {currentProjectId ? "Atualizar Projeto" : "Salvar Projeto"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowThemeSelector(true)}
            className="flex items-center"
          >
            <Palette className="h-4 w-4 mr-2" />
            Temas
          </Button>

          <div className="flex items-center px-3 py-1.5 bg-brand-50 text-brand-700 rounded-full border border-brand-100">
            <CreditCard className="h-4 w-4 mr-2" />
            <span className="font-medium">Créditos: {credits}</span>
          </div>
          
          {user && (
            <Button
              variant="ghost"
              className="text-gray-600"
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/auth");
              }}
            >
              Sair
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel for history */}
        {isHistoryOpen && (
          <HistoryPanel 
            history={history}
            currentHistoryIndex={currentHistoryIndex}
            onRestoreVersion={handleRestoreVersion}
            onDeleteVersion={handleDeleteVersion}
          />
        )}

        {/* Center panel (website preview) */}
        <div className="flex-1 flex flex-col">
          {iframeContent ? (
            <>
              <EditorToolbar 
                onUndo={handleUndo}
                onRedo={handleRedo}
                onViewChange={setCurrentView}
                currentView={currentView}
                onExportCode={exportCode}
                onPublish={publishSite}
                canUndo={currentHistoryIndex > 0}
                canRedo={currentHistoryIndex < history.length - 1}
                onToggleColorPalette={() => setShowColorPalette(!showColorPalette)}
                onToggleComponents={() => setShowComponents(!showComponents)}
                onToggleCodeView={() => setShowCodeView(!showCodeView)}
                onToggleImageLibrary={() => setShowImageLibrary(!showImageLibrary)}
              />
              
              <div className="flex-1 relative">
                <div 
                  className={`absolute inset-0 transition-all duration-300 ${
                    currentView === 'tablet' 
                      ? 'p-8 max-w-[768px] mx-auto' 
                      : currentView === 'mobile' 
                        ? 'p-8 max-w-[375px] mx-auto' 
                        : ''
                  }`}
                >
                  <iframe
                    title="Geração do Site"
                    className="w-full h-full border-0 shadow-md"
                    srcDoc={iframeContent}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="max-w-md text-center p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Crie seu site com IA
                </h2>
                <ContentGenerator onContentGenerated={handleContentGenerated} />
              </div>
            </div>
          )}

          {/* Bottom action bar (only visible when a site is generated) */}
          {iframeContent && (
            <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant={isHistoryOpen ? "default" : "outline"}
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className={isHistoryOpen ? "bg-brand-600" : ""}
                >
                  <History className="h-4 w-4 mr-2" />
                  {isHistoryOpen ? "Fechar Histórico" : "Histórico"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={exportCode}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Código
                </Button>
                
                <Button
                  onClick={publishSite}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Publicar Site
                </Button>
              </div>
              
              <Button
                variant={isChatOpen ? "default" : "outline"}
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={isChatOpen ? "bg-brand-600" : ""}
              >
                <Bot className="h-4 w-4 mr-2" />
                {isChatOpen ? "Fechar Chat" : "Abrir Chat"}
              </Button>
            </div>
          )}
        </div>

        {/* Right panel (chat) - only visible when a site is generated and chat is open */}
        {iframeContent && isChatOpen && (
          <ChatPanel 
            messages={messages}
            onSendMessage={sendChatMessage}
            chatInput={chatInput}
            setChatInput={setChatInput}
            suggestedPrompts={suggestedPrompts}
            onSuggestedPromptClick={handleSuggestedPromptClick}
            credits={credits}
            onBuyCredits={() => setShowPlansModal(true)}
            isProcessing={isProcessingMessage}
          />
        )}
      </div>

      {/* Theme Selector */}
      {showThemeSelector && (
        <ThemeSelector 
          themes={availableThemes}
          onSelectTheme={applyTheme}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {/* Save Project Dialog */}
      <SaveProjectDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={saveProject}
        initialTitle={projectTitle}
        initialDescription={projectDescription}
      />

      {/* Plans Modal */}
      <Dialog open={showPlansModal} onOpenChange={setShowPlansModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adquira mais créditos</DialogTitle>
            <DialogDescription>
              Escolha um dos planos abaixo para continuar criando sites incríveis.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="border rounded-lg p-4 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer">
              <h3 className="font-medium text-lg">Plano Básico</h3>
              <p className="text-2xl font-bold my-2">R$39<span className="text-sm font-normal text-gray-500">/mês</span></p>
              <ul className="space-y-2 mt-4 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 20 créditos por mês
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Domínio personalizado
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Suporte por email
                </li>
              </ul>
              <Button className="w-full mt-4">Escolher Plano</Button>
            </div>

            <div className="border rounded-lg p-4 border-brand-200 bg-brand-50 hover:shadow-md transition-all cursor-pointer">
              <div className="absolute -top-3 right-4 bg-brand-600 text-white text-xs px-2 py-1 rounded">POPULAR</div>
              <h3 className="font-medium text-lg">Plano Pro</h3>
              <p className="text-2xl font-bold my-2">R$79<span className="text-sm font-normal text-gray-500">/mês</span></p>
              <ul className="space-y-2 mt-4 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 50 créditos por mês
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Domínio personalizado
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Suporte prioritário
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Remoção de marca d'água
                </li>
              </ul>
              <Button className="w-full mt-4 bg-brand-600 hover:bg-brand-700">Escolher Plano</Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPlansModal(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Creator;
