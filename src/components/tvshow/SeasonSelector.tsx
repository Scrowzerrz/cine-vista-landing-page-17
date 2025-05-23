
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, ChevronRight } from 'lucide-react';

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
    <motion.div 
      className="relative mb-12 border-b border-gray-700/40 pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-5">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="bg-red-600/20 p-2 rounded-full">
            <Tv className="h-5 w-5 text-red-500" />
          </div>
          <h4 className="text-xl font-bold text-gray-200">Temporadas</h4>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-full px-4 py-2 shadow-inner"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Temporada selecionada:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-semibold text-white">{selectedSeason}</span>
              <Switch 
                className="data-[state=checked]:bg-red-600" 
                onCheckedChange={() => {
                  const nextSeason = (parseInt(selectedSeason) % seasons.length) + 1;
                  setSelectedSeason(nextSeason.toString());
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
      
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-2 pb-2">
          <AnimatePresence>
            {seasons.map((season) => (
              <motion.div
                key={season.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
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
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setSelectedSeason(season.number.toString())}
                  className={`relative px-5 py-6 rounded-xl transition-all duration-300 overflow-hidden ${
                    selectedSeason === season.number.toString() 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-500 text-white shadow-lg shadow-red-500/20' 
                      : 'bg-gray-800/80 border-gray-700/50 text-gray-300 hover:border-red-500/50'
                  }`}
                >
                  {selectedSeason === season.number.toString() && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/20"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0.2, 0.3, 0.2],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-1.5">
                    <span className="font-medium text-lg">{season.number}</span>
                    {selectedSeason === season.number.toString() && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default SeasonSelector;
