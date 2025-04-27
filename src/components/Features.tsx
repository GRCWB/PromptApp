
import React from "react";
import { 
  Code, 
  Sparkles, 
  Globe, 
  Rocket, 
  Database, 
  Smartphone, 
  Languages, 
  Zap, 
  Lock, 
  CreditCard 
} from "lucide-react";

const featuresList = [
  {
    icon: <Languages className="h-6 w-6 text-brand-600" />,
    title: "100% em Português",
    description: "Escreva seus prompts em português e receba um site completo com textos relevantes para o mercado brasileiro."
  },
  {
    icon: <Database className="h-6 w-6 text-brand-600" />,
    title: "Backend Funcional",
    description: "Não apenas páginas estáticas. Crie sistemas completos com autenticação, banco de dados e APIs."
  },
  {
    icon: <Zap className="h-6 w-6 text-brand-600" />,
    title: "Deploy em 1 Clique",
    description: "Publique seu site instantaneamente com um único clique. Sem configurações complexas ou hospedagens caras."
  },
  {
    icon: <CreditCard className="h-6 w-6 text-brand-600" />,
    title: "Integrações BR",
    description: "Integração nativa com Pix, Mercado Pago, Correios e outras soluções populares no Brasil."
  },
  {
    icon: <Smartphone className="h-6 w-6 text-brand-600" />,
    title: "Responsivo por Padrão",
    description: "Todos os sites gerados são 100% responsivos, funcionando perfeitamente em celulares, tablets e desktops."
  },
  {
    icon: <Lock className="h-6 w-6 text-brand-600" />,
    title: "Proprietário do Código",
    description: "Você tem acesso completo ao código-fonte do seu projeto para customizações avançadas."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que torna o <span className="gradient-text">PromptApp</span> único
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma plataforma feita para brasileiros criarem sites e aplicativos completos sem
            conhecimento técnico, eliminando barreiras de desenvolvimento.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-brand-50 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
