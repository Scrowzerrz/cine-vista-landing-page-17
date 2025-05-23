
import React from 'react';
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
    <div className="relative mb-10">
      <motion.h4 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-white mb-6 flex items-center"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-600 rounded-full mr-3"></div>
        Escolher Temporada
      </motion.h4>
      
      <div className="flex flex-wrap gap-3">
        {seasons.map((season, index) => (
          <motion.button
            key={season.number}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => setSelectedSeason(season.number.toString())}
            className={`group relative overflow-hidden px-6 py-4 rounded-2xl transition-all duration-300 border-2 min-w-[100px] ${
              selectedSeason === season.number.toString() 
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-500/40 scale-105' 
                : 'bg-gray-900/50 border-gray-700/40 text-gray-300 hover:border-red-500/60 hover:bg-gray-800/70 hover:text-white hover:scale-105'
            }`}
          >
            <div className="relative z-10 text-center">
              <div className="font-bold text-lg">T{season.number}</div>
              <div className="text-xs opacity-75">{season.year}</div>
            </div>
            
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SeasonSelector;
