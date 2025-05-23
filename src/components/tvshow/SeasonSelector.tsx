
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
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
    <div className="relative mb-12 border-b border-gray-700/40 pb-2">
      <div className="flex items-center justify-between">
        <motion.h4 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-semibold text-gray-200 mb-4"
        >
          Selecionar Temporada
        </motion.h4>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Temporada {selectedSeason}</span>
            <Switch 
              className="data-[state=checked]:bg-red-600" 
              onCheckedChange={() => {
                const nextSeason = (parseInt(selectedSeason) % seasons.length) + 1;
                setSelectedSeason(nextSeason.toString());
              }}
            />
          </div>
        </motion.div>
      </div>
      
      <ScrollArea className="w-full pb-4">
        <div className="flex gap-2 pb-2">
          {seasons.map((season) => (
            <Button
              key={season.number}
              variant="outline"
              onClick={() => setSelectedSeason(season.number.toString())}
              className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                selectedSeason === season.number.toString() 
                  ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/20' 
                  : 'bg-gray-800/80 border-gray-700/50 text-gray-300 hover:border-red-500/50'
              }`}
            >
              <span className="font-medium">{season.number}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SeasonSelector;
