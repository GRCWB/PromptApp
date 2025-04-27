
import React from "react";
import { MessageSquare, Sparkles, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <MessageSquare className="h-6 w-6 text-white" />,
    title: "Descreva seu projeto",
    description: "Explique em linguagem natural o que você precisa. Quanto mais detalhes, melhor será o resultado final."
  },
  {
    number: "02",
    icon: <Sparkles className="h-6 w-6 text-white" />,
    title: "IA gera seu site completo",
    description: "Nossa IA avançada transforma sua descrição em um site ou aplicativo completo, com frontend, backend e banco de dados."
  },
  {
    number: "03",
    icon: <Rocket className="h-6 w-6 text-white" />,
    title: "Publique em segundos",
    description: "Com um clique, seu site estará online com um domínio personalizado, pronto para compartilhar com o mundo."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como funciona o <span className="gradient-text">PromptApp</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Um processo simples de 3 passos que transforma sua ideia em um site ou aplicativo funcional em minutos, não em semanas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-brand-500 to-transparent z-0 -translate-x-1/2" />
              )}
              
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative z-10 h-full flex flex-col items-center text-center">
                <div className="flex items-center justify-center rounded-full h-16 w-16 bg-gradient-to-r from-brand-600 to-purple-600 mb-6">
                  {step.icon}
                </div>
                <span className="text-sm font-medium text-brand-600 mb-2">PASSO {step.number}</span>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
