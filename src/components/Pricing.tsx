import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const pricingPlans = [
  {
    name: "Starter",
    monthlyPrice: "R$ 49",
    yearlyPrice: "R$ 529",
    yearlyDiscount: "Economize 10%",
    description: "Ideal para iniciantes e projetos pessoais",
    features: [
      "Até 3 projetos ativos",
      "Templates básicos",
      "Subdomínio *.promptapp.com",
      "1GB de armazenamento",
      "5.000 visitantes/mês",
      "Suporte por email",
      "Atualizações mensais"
    ],
    cta: "Comece Agora",
    popular: false
  },
  {
    name: "Pro",
    monthlyPrice: "R$ 99",
    yearlyPrice: "R$ 1 069",
    yearlyDiscount: "Economize 10%",
    description: "Para profissionais e pequenos negócios",
    features: [
      "Até 20 projetos ativos",
      "Domínio personalizado",
      "Editor visual avançado",
      "10GB de armazenamento",
      "50.000 visitantes/mês",
      "Suporte via chat",
      "Integrações com APIs BR",
      "Backup automático"
    ],
    cta: "Escolher Plano Pro",
    popular: true
  },
  {
    name: "Enterprise",
    monthlyPrice: "R$ 299",
    yearlyPrice: "R$ 3 229",
    yearlyDiscount: "Economize 10%",
    description: "Para empresas e agências de maior porte",
    features: [
      "Projetos ilimitados",
      "White-label completo",
      "Integrações Pix/Mercado Pago",
      "50GB de armazenamento",
      "500.000 visitantes/mês",
      "Suporte prioritário com SLA 24h",
      "Acesso antecipado a novos recursos",
      "Ambiente de testes e produção"
    ],
    cta: "Falar com Vendas",
    popular: false
  }
];

const Pricing = () => {
  const [billingType, setBillingType] = React.useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planos e preços acessíveis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha o plano ideal para suas necessidades com nossa política de preços transparente. Todos os planos incluem teste grátis de 7 dias.
          </p>
          
        <div className="flex items-center justify-center mt-8 space-x-4">
          <button
            onClick={() => setBillingType("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ease-in-out transform hover:scale-105 ${
              billingType === "monthly"
                ? "bg-brand-600 text-white scale-105"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingType("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ease-in-out transform hover:scale-105 ${
              billingType === "yearly"
                ? "bg-brand-600 text-white scale-105"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Anual (10% de desconto)
          </button>
        </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl transition-all duration-500 ease-in-out transform hover:translate-y-[-8px] hover:shadow-xl ${
                plan.popular
                  ? "border-2 border-brand-500 shadow-lg scale-105 z-10"
                  : "border border-gray-200 shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="bg-brand-500 text-white text-center text-sm font-medium py-1">
                  Mais Popular
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      {billingType === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    {billingType === "monthly" ? (
                      <span className="text-gray-500 ml-2">/mês</span>
                    ) : (
                      <span className="text-gray-500 ml-2">/ano</span>
                    )}
                  </div>
                  {billingType === "yearly" && (
                    <span className="text-brand-600 text-sm font-medium">
                      {plan.yearlyDiscount}
                    </span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-brand-500 mr-2 shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-brand-600 hover:bg-brand-700"
                      : "bg-white border border-brand-600 text-brand-600 hover:bg-brand-50"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
