
import React from 'react';
import { Button } from "@/components/ui/button";
import { HistoryAction } from '@/utils/editorUtils';
import { 
  Clock, 
  ArrowLeftCircle, 
  Trash, 
  CheckCircle2 
} from "lucide-react";

interface HistoryPanelProps {
  history: HistoryAction[];
  currentHistoryIndex: number;
  onRestoreVersion: (index: number) => void;
  onDeleteVersion: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  currentHistoryIndex,
  onRestoreVersion,
  onDeleteVersion
}) => {
  return (
    <div className="w-80 border-l border-gray-200 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Histórico de Alterações
        </h3>
        <p className="text-sm text-gray-500">Gerencie as versões do seu site</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma alteração registrada ainda.</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {history.map((action, index) => (
              <div 
                key={action.id}
                className={`p-3 rounded-md ${
                  index === currentHistoryIndex 
                    ? "bg-brand-50 border border-brand-200" 
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {action.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(action.timestamp).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex space-x-1">
                    {index !== currentHistoryIndex && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onRestoreVersion(index)}
                        className="h-7 w-7"
                      >
                        <ArrowLeftCircle className="h-4 w-4 text-brand-600" />
                      </Button>
                    )}
                    
                    {index === currentHistoryIndex && (
                      <CheckCircle2 className="h-4 w-4 text-brand-600 mr-1" />
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDeleteVersion(action.id)}
                      className="h-7 w-7 text-gray-400 hover:text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
