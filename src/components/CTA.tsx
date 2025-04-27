import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Logo from "./Logo";

const CTA = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white">
      <div className="container mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-8">
            <Logo showText={false} className="transform scale-150" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transforme suas ideias em sites funcionais hoje mesmo
          </h2>
          <p className="text-xl opacity-90 mb-8 md:text-2xl">
            Teste gratuitamente por 7 dias. Sem compromisso, sem cartão de crédito.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>Sem conhecimento técnico</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>100% em português</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>Suporte local</span>
            </div>
          </div>
          
          <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100 h-12 px-8 rounded-lg text-lg">
            Começar Teste Gratuito
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <p className="mt-4 text-sm opacity-75">
            Junte-se a mais de 5.000 criadores e empresas brasileiras
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
