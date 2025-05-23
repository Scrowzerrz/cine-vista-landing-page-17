
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayIcon, ListPlusIcon, ChevronDownIcon, InfoIcon, StarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-start text-left overflow-hidden">
      {/* Background with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1626972774899-5e34ecebcc0f?w=1920&h=1080&fit=crop&q=80&auto=format")',
        }}
      >
        {/* Enhanced Gradient Overlays */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
        
        {/* Animated Particles Effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0 
              }}
              animate={{ 
                y: [0, -100, 0],
                opacity: [0, 1, 0] 
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 px-6 sm:px-12 md:px-20 lg:px-32 max-w-4xl">
        {/* Title Card with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img 
              src="https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7tKqQR.jpg" 
              alt="The Last of Us Title Card"
              className="w-full max-w-lg opacity-95 hover:opacity-100 transition-opacity duration-300" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </motion.div>

        {/* Rating and Info Bar */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-500/30">
            <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
            <span className="text-yellow-400 font-bold">9.1</span>
            <span className="text-gray-300 ml-1">/10</span>
          </div>
          <div className="bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full border border-red-500/50">
            <span className="text-white font-semibold text-sm">2023 • Drama • HBO</span>
          </div>
        </motion.div>
        
        {/* Description with Improved Typography */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed font-light"
        >
          Em um mundo pós-apocalíptico devastado por uma pandemia fúngica, Joel Miller deve escoltar Ellie através dos Estados Unidos em uma jornada perigosa que testará os limites da sobrevivência humana.
        </motion.p>

        {/* Enhanced Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold px-8 py-4 rounded-xl text-base shadow-xl hover:shadow-2xl hover:shadow-red-600/50 transition-all duration-300 border border-red-500/50"
            >
              <PlayIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              ASSISTIR AGORA
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="group bg-white/10 hover:bg-white/20 text-white border-white/40 hover:border-white/60 font-semibold px-8 py-4 rounded-xl text-base backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ListPlusIcon className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
              MINHA LISTA
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/80 hover:text-white hover:bg-white/15 rounded-full p-3 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
            >
              <InfoIcon className="h-7 w-7" />
              <span className="sr-only">Mais Informações</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-wrap gap-3 mt-8"
        >
          {['Criadores: Craig Mazin, Neil Druckmann', '9 Episódios', 'Legendado/Dublado'].map((info, index) => (
            <div key={index} className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50 text-gray-300 text-sm">
              {info}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-sm mb-2 opacity-80 group-hover:opacity-100 transition-opacity">Role para baixo</span>
          <div className="p-2 border-2 border-white/30 rounded-full group-hover:border-white/60 transition-colors">
            <ChevronDownIcon className="w-6 h-6" />
          </div>
        </motion.div>
      </motion.div>

      {/* Ambient Light Effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
  );
};

export default HeroSection;
