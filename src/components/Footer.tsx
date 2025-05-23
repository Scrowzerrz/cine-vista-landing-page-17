
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 px-4 md:px-8 lg:px-16 py-16">
      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            FILMES ONLINE GRÁTIS - SÉRIES ONLINE - ANIMES ONLINE
          </h2>
        </div>

        {/* Description */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold mb-4">
            Filmes Online - Assistir Filmes - Filmes Online Grátis
          </h3>
          <p className="text-sm leading-relaxed mb-4">
            Filmes Online - Assistir Filmes Online Grátis - Filmes Completos Dublados
          </p>
          <p className="text-sm leading-relaxed">
            A Pobreflix HD é uma plataforma de site e aplicativo para assistir filmes e séries online grátis! O nosso site utiliza todas as séries 
            do site sem logotipos e dublado, e como o nosso site é um indexador automático, somos os mais rápidos pesquisadores do brasil. 
            Pobreflix HD não armazena nada filmes e séries no nosso site, por isso só completamente dentro da lei. A Pobreflix HD indexa 
            conteúdos encontrados na web automaticamente usando robôs e inteligência artificial. O uso do Pobreflix HD é inteiramente 
            responsabilidade do usuário. A distribuição de filmes na parte de platformas como streamings, também existe outras. Qualquer 
            violação das direitas autorais deve contactar o próprio distribuidor. Em caso de dúvidas ou problemas sobre conteúdos do 
            Pobreflix HD, favor entrar em contato conosco através dos métodos de contato fornecidos.
          </p>
        </div>

        {/* Links sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Legal Notice */}
          <div>
            <h4 className="text-white font-semibold mb-4">AVISO LEGAL</h4>
            <p className="text-sm mb-4">
              Nós não armazenamos nenhum dos arquivos em nenhum servidor. Todos os conteúdos são fornecidos por terceiros sem qualquer tipo de afiliação.
            </p>
          </div>

          {/* Important Information */}
          <div>
            <h4 className="text-white font-semibold mb-4">Informações</h4>
            <h5 className="text-sm font-medium mb-2">IMPORTANTE</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Política DMCA</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos e Condições</a></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-white font-semibold mb-4">Parceiros</h4>
            <h5 className="text-sm font-medium mb-2">CONTATE-NOS</h5>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Overflix</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vizer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">PopCorn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RedeCanais</a></li>
              <li><a href="#" className="hover:text-white transition-colors">MegaFilmes</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; 2024 Pobreflix HD. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
