import React from "react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo className="mb-4" />
            <p className="text-gray-600 mb-4">
              Transformando prompts em português em sites e aplicativos completos e funcionais.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Plataforma</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Funcionalidades</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Templates</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Integrações</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Preços</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Documentação</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Tutoriais</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Comunidade</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Sobre nós</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Carreiras</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Contato</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-600">Afiliados</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} PromptApp. Todos os direitos reservados.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-brand-600">Termos</a>
            <a href="#" className="text-gray-600 hover:text-brand-600">Privacidade</a>
            <a href="#" className="text-gray-600 hover:text-brand-600">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
