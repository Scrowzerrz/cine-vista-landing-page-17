
import React from 'react';
import { Separator } from "@/components/ui/separator"; // Importando o Separator
import { PlayIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <div className="flex items-center justify-center mb-4">
            <PlayIcon className="h-8 w-8 text-red-500 mr-2" />
            <span className="text-3xl font-bold text-white">
              POBRE<span className="text-red-500">FLIX</span>
            </span>
          </div>
          <p className="text-lg md:text-xl font-semibold text-white">
            FILMES ONLINE GRÁTIS - SÉRIES ONLINE - ANIMES ONLINE
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Sua fonte de entretenimento digital.
          </p>
        </div>

        <Separator className="my-8 md:my-10 bg-gray-700/50" />

        {/* Description */}
        <div className="mb-10 md:mb-12 text-center md:text-left">
          <h3 className="text-xl font-semibold text-white mb-3">
            Sobre a Pobreflix HD
          </h3>
          <p className="text-sm leading-relaxed text-gray-300 mb-4 max-w-3xl mx-auto md:mx-0">
            A Pobreflix HD é uma plataforma de site e aplicativo para assistir filmes e séries online grátis! Nosso sistema indexa automaticamente conteúdos da web, oferecendo uma vasta biblioteca de entretenimento. Não armazenamos arquivos em nossos servidores, operando dentro da legalidade.
          </p>
        </div>
        
        <Separator className="my-8 md:my-10 bg-gray-700/50" />

        {/* Links sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-sm">
          <div>
            <h4 className="text-base font-semibold text-white mb-4">AVISO LEGAL</h4>
            <p className="mb-4">
              Não armazenamos nenhum arquivo em nossos servidores. Todos os conteúdos são fornecidos por terceiros sem afiliação.
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4">INFORMAÇÕES IMPORTANTES</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-red-400 transition-colors">Política DMCA</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Termos e Condições</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-white mb-4">PARCEIROS</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-red-400 transition-colors">Overflix</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">Vizer</a></li>
              <li><a href="#" className="hover:text-red-400 transition-colors">RedeCanais</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <Separator className="my-8 md:my-10 bg-gray-700/50" />
        <div className="text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Pobreflix HD. Todos os direitos reservados.</p>
          <p className="mt-1">Este site é um indexador de links e não armazena arquivos.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
