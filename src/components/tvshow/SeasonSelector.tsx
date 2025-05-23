
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, ChevronRight, Play } from 'lucide-react';

interface SeasonSelectorProps {
  seasons: {
    number: number;
    year: string;
    episodes: {
      number: number;
      title: string;
      runtime: string;
      overview: string;
      image: string;
    }[];
  }[];
  selectedSeason: string;
  setSelectedSeason: (season: string) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ 
  seasons, 
  selectedSeason, 
  setSelectedSeason 
}) => {
  return (
    <motion.div 
      className="relative mb-8 sm:mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header Section */}
      <motion.div 
        className="flex items-center gap-3 mb-6 sm:mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="relative">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-2xl shadow-lg">
            <Tv className="h-6 w-6 text-white" />
          </div>
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <div>
          <h4 className="text-2xl sm:text-3xl font-bold text-white">Temporadas Disponíveis</h4>
          <p className="text-gray-400 text-sm sm:text-base">Escolha uma temporada para começar</p>
        </div>
      </motion.div>
      
      {/* Seasons Grid */}
      <ScrollArea className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pb-4">
          <AnimatePresence>
            {seasons.map((season) => {
              const isSelected = selectedSeason === season.number.toString();
              return (
                <motion.div
                  key={season.number}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      delay: 0.1 * season.number,
                      type: "spring",
                      stiffness: 300,
                      damping: 24
                    }
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSeason(season.number.toString())}
                    className={`relative w-full h-28 sm:h-32 p-0 rounded-2xl transition-all duration-300 overflow-hidden border-2 ${
                      isSelected
                        ? 'bg-gradient-to-br from-red-600 via-red-700 to-red-800 border-red-400 shadow-lg shadow-red-500/30' 
                        : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10'
                    }`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
                      <div className="absolute top-2 right-2 w-8 h-8 border border-white/20 rounded-full" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border border-white/20 rounded-full" />
                    </div>
                    
                    {/* Selected Animation */}
                    {isSelected && (
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-red-500/30 to-red-600/20"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    )}
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2 p-3">
                      <motion.div 
                        className={`text-2xl sm:text-3xl font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}
                        animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {season.number}
                      </motion.div>
                      
                      <div className="text-center">
                        <div className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                          {season.year}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-red-200' : 'text-gray-500'}`}>
                          {season.episodes.length} episódios
                        </div>
                      </div>
                      
                      {/* Play Icon for Selected */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-2 right-2"
                        >
                          <div className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                            <Play className="h-3 w-3 text-white" fill="white" />
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Arrow indicator for selected */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-2 right-2"
                        >
                          <ChevronRight className="h-4 w-4 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      {/* Bottom gradient line */}
      <motion.div 
        className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full mt-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  );
};

export default SeasonSelector;
