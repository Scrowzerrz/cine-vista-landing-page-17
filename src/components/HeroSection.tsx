
import React from 'react';
import { Button } from '@/components/ui/button'; // Importando o Button do shadcn
import { PlayIcon, ListPlusIcon, ChevronDownIcon } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative h-[80vh] md:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1626972774899-5e34ecebcc0f?w=1920&h=1080&fit=crop&q=80")', // Adicionado q=80 para qualidade
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div> {/* Aumentado um pouco o overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 tracking-tight leading-tight"> {/* Ajustes de tipografia */}
          THE<br />
          <span className="text-red-500">LAST</span><br />
          OF US
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-base w-full sm:w-auto">
            <PlayIcon className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            ASSISTIR SÉRIE
          </Button>
          <Button variant="outline" size="lg" className="bg-gray-700/50 hover:bg-gray-600/70 text-white border-gray-600/80 hover:border-gray-500/80 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-base backdrop-blur-sm w-full sm:w-auto">
            <ListPlusIcon className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            ADICIONAR À LISTA
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70 hover:text-white transition-colors cursor-pointer">
        <ChevronDownIcon className="w-8 h-8 md:w-10 md:h-10" />
      </div>
    </div>
  );
};

export default HeroSection;
