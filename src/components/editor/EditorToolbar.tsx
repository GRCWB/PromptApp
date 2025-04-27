
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Undo,
  Redo,
  Smartphone,
  Tablet,
  Laptop,
  Download,
  Share2,
  Eye,
  Palette,
  Layers,
  Code,
  Image
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EditorToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onViewChange: (view: 'desktop' | 'tablet' | 'mobile') => void;
  currentView: 'desktop' | 'tablet' | 'mobile';
  onExportCode: () => void;
  onPublish: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onToggleColorPalette: () => void;
  onToggleComponents: () => void;
  onToggleCodeView: () => void;
  onToggleImageLibrary: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onUndo,
  onRedo,
  onViewChange,
  currentView,
  onExportCode,
  onPublish,
  canUndo,
  canRedo,
  onToggleColorPalette,
  onToggleComponents,
  onToggleCodeView,
  onToggleImageLibrary
}) => {
  return (
    <div className="p-2 border-b border-gray-200 bg-white flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onUndo} 
                disabled={!canUndo}
                className="h-8 w-8"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Desfazer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onRedo} 
                disabled={!canRedo}
                className="h-8 w-8"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refazer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-6 border-r border-gray-200 mx-2"></div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentView === 'desktop' ? "default" : "outline"} 
                size="icon" 
                onClick={() => onViewChange('desktop')}
                className="h-8 w-8"
              >
                <Laptop className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Desktop</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentView === 'tablet' ? "default" : "outline"} 
                size="icon" 
                onClick={() => onViewChange('tablet')}
                className="h-8 w-8"
              >
                <Tablet className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tablet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={currentView === 'mobile' ? "default" : "outline"} 
                size="icon" 
                onClick={() => onViewChange('mobile')}
                className="h-8 w-8"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mobile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onToggleColorPalette}
                className="h-8 w-8"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cores & Estilos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onToggleComponents}
                className="h-8 w-8"
              >
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Componentes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onToggleImageLibrary}
                className="h-8 w-8"
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Biblioteca de Imagens</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={onToggleCodeView}
                className="h-8 w-8"
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizar Código</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="h-6 border-r border-gray-200 mx-2"></div>
        
        <Button variant="outline" onClick={onExportCode} className="h-8 px-3">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        
        <Button onClick={onPublish} className="h-8 px-3 bg-brand-600 hover:bg-brand-700 text-white">
          <Share2 className="h-4 w-4 mr-2" />
          Publicar
        </Button>
      </div>
    </div>
  );
};

export default EditorToolbar;
