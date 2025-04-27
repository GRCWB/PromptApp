
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Folder, Share2, Globe, Pencil, Trash2, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Project {
  id: string;
  title: string;
  description: string;
  last_edited: string;
}

const ProjectsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: projects, isLoading, error, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      
      // If user is not logged in, return an empty array instead of redirecting
      if (!session.session) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('last_edited', { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar projetos:", error);
        toast({
          title: "Erro ao carregar projetos",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Project[];
    }
  });

  // Check if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) throw error;
      
      toast({
        title: "Projeto excluído",
        description: "Seu projeto foi excluído com sucesso!",
      });
      
      refetch(); // Refresh the projects list
    } catch (error: any) {
      toast({
        title: "Erro ao excluir projeto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Show loading state while checking authentication
  if (isLoading && isAuthenticated) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if there was an error loading projects
  if (error && isAuthenticated) {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-600">Erro ao carregar projetos</h3>
          <p className="text-gray-600 mt-2">Ocorreu um erro ao buscar seus projetos. Por favor, tente novamente.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => refetch()}
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-brand-50/50 to-purple-50/50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
            Meus Projetos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Gerencie seus projetos, edite e compartilhe com o mundo
          </p>
        </div>

        {isAuthenticated === false ? (
          // Show login message if user is not authenticated
          <div className="text-center p-12 bg-white/80 rounded-xl shadow-sm max-w-xl mx-auto">
            <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Acesso restrito</h3>
            <p className="text-gray-500 mt-2 mb-6">
              Você precisa estar logado para visualizar e gerenciar seus projetos.
              Faça login para continuar.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/auth')} 
                className="bg-brand-600 hover:bg-brand-700 flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Entrar na sua conta</span>
              </Button>
            </div>
          </div>
        ) : isAuthenticated && projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className="h-full overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="space-y-1 pb-4 bg-gradient-to-r from-brand-50 to-purple-50">
                    <div className="flex items-center space-x-2">
                      <Folder className="h-5 w-5 text-brand-600" />
                      <CardTitle className="text-xl font-semibold">{project.title}</CardTitle>
                    </div>
                    <p className="text-sm text-gray-500">
                      Última edição: {new Date(project.last_edited).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/editor/${project.id}`)}
                        className="flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-600 border-brand-200"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Editar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-600 border-purple-200"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Publicar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 hover:bg-brand-50"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Compartilhar</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex items-center gap-1 hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Excluir</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : isAuthenticated ? (
          <div className="text-center p-12 bg-white/80 rounded-xl shadow-sm max-w-xl mx-auto">
            <Folder className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Nenhum projeto encontrado</h3>
            <p className="text-gray-500 mt-2 mb-6">Você ainda não criou nenhum projeto. Que tal começar agora?</p>
            <Button onClick={() => navigate('/creator')} className="bg-brand-600 hover:bg-brand-700">
              Criar novo projeto
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectsList;
