
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';

interface SeasonSelectorProps {
  seasons: {
    number: number;
    year: string;
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
    <div className="relative mb-8">
      <motion.h4 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold text-white mb-4 flex items-center"
      >
        <div className="w-1 h-5 bg-red-500 rounded-full mr-3"></div>
        Temporadas Disponíveis
      </motion.h4>
      
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {seasons.map((season, index) => (
            <motion.div
              key={season.number}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                onClick={() => setSelectedSeason(season.number.toString())}
                className={`px-6 py-3 rounded-2xl transition-all duration-300 border-2 min-w-[120px] ${
                  selectedSeason === season.number.toString() 
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-500/30 transform scale-105' 
                    : 'bg-gray-800/60 border-gray-700/50 text-gray-300 hover:border-red-500/50 hover:bg-gray-800/80 hover:text-white'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold text-lg">T{season.number}</div>
                  <div className="text-xs opacity-80">{season.year}</div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SeasonSelector;
