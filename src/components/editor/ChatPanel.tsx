
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { Message } from "@/utils/editorUtils";
import { useToast } from "@/hooks/use-toast";

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  suggestedPrompts: string[];
  onSuggestedPromptClick: (prompt: string) => void;
  credits: number;
  onBuyCredits: () => void;
  isProcessing: boolean;
}

// Extending the Message type locally until it's updated in editorUtils
interface ExtendedMessage extends Message {
  success?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  chatInput,
  setChatInput,
  suggestedPrompts,
  onSuggestedPromptClick,
  credits,
  onBuyCredits,
  isProcessing
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom of chat when messages change
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    if (credits <= 0) {
      toast({
        title: "Créditos esgotados",
        description: "Você precisa de créditos para continuar usando o assistente",
        variant: "destructive"
      });
      onBuyCredits();
      return;
    }
    
    onSendMessage(chatInput);
    setChatInput("");
    
    // Focus the textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-80 border-l border-gray-200 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Chat com IA</h3>
        <p className="text-sm text-gray-500">Peça alterações para seu site</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Nenhuma mensagem ainda. Peça alterações para seu site!</p>
            
            <div className="mt-6 space-y-2">
              <p className="text-xs text-gray-500 mb-2">Sugestões:</p>
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                  onClick={() => onSuggestedPromptClick(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => {
              // Cast to the extended message type that includes success
              const extMessage = message as ExtendedMessage;
              return (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-brand-600 text-white"
                      : message.error
                        ? "bg-red-50 text-red-800 border border-red-200"
                        : extMessage.success
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.error && (
                    <div className="flex items-center gap-2 mb-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Erro</span>
                    </div>
                  )}
                  {extMessage.success && (
                    <div className="flex items-center gap-2 mb-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Sucesso</span>
                    </div>
                  )}
                  {message.content}
                  {message.role === "assistant" && isProcessing && index === messages.length - 1 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Aplicando alterações...
                    </div>
                  )}
                </div>
              </div>
            )})}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[60px] resize-none"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            disabled={!chatInput.trim() || credits <= 0 || isProcessing}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {credits <= 0 && (
          <p className="text-xs text-red-500 mt-2">
            Seus créditos acabaram.{" "}
            <button
              type="button"
              className="text-brand-600 underline"
              onClick={onBuyCredits}
            >
              Adquira mais
            </button>
          </p>
        )}
        {isProcessing && (
          <p className="text-xs text-brand-600 mt-2 flex items-center">
            <span className="inline-block h-2 w-2 bg-brand-600 rounded-full mr-2 animate-pulse"></span>
            Processando sua solicitação...
          </p>
        )}
      </form>
    </div>
  );
};

export default ChatPanel;
