import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, ListPlusIcon, ChevronDownIcon, InfoIcon } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative h-[90vh] md:h-screen flex items-center justify-start text-left overflow-hidden"> {/* Ajustado para 90vh e justify-start, text-left */}
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1626972774899-5e34ecebcc0f?w=1920&h=1080&fit=crop&q=80&auto=format")',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div> {/* Overlay sutil */}
        {/* Gradiente mais elaborado */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
      </div>

      {/* Content with fade-in animation */}
      <div className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-24 max-w-3xl animate-fade-in"> {/* Aumentado padding e max-width, adicionado animate-fade-in */}
        <img 
          src="https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7tKqQR.jpg" 
          alt="The Last of Us Title Card"
          className="w-full max-w-md mb-4 md:mb-6 opacity-90" 
        />
        
        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 md:mb-8 max-w-xl leading-relaxed">
          Em um mundo pós-apocalíptico devastado, Joel e Ellie lutam pela sobrevivência enquanto atravessam os Estados Unidos enfrentando perigos inimagináveis.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4">
          <Button 
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-base w-full sm:w-auto shadow-lg hover:shadow-2xl hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105"
          >
            <PlayIcon className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            ASSISTIR AGORA
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/50 font-semibold px-6 py-3 md:px-8 md:py-4 rounded-lg text-sm md:text-base backdrop-blur-sm w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ListPlusIcon className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            MINHA LISTA
          </Button>
           <Button 
            variant="ghost" 
            size="icon" 
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors duration-300 sm:ml-2"
           >
            <InfoIcon className="h-6 w-6 md:h-7 md:h-7" />
            <span className="sr-only">Mais Informações</span>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/70 hover:text-white transition-colors cursor-pointer">
        <ChevronDownIcon className="w-10 h-10 md:w-12 md:h-12" />
      </div>
    </div>
  );
};

export default HeroSection;
