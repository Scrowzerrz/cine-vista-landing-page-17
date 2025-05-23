
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye, Grid3X3 } from 'lucide-react';
import EpisodeCard from './EpisodeCard';

interface EpisodeListProps {
  episodes: {
    number: number;
    title: string;
    runtime: string;
    overview: string;
    image: string;
  }[];
  selectedSeason: string;
  expandedEpisodes: Record<string, boolean>;
  toggleExpandEpisodes: (seasonNumber: string) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodes, 
  selectedSeason, 
  expandedEpisodes, 
  toggleExpandEpisodes 
}) => {
  // Display only first 3 episodes when not expanded
  const displayedEpisodes = expandedEpisodes[selectedSeason] 
    ? episodes 
    : episodes.slice(0, 3);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="backdrop-blur-sm bg-gray-900/30 rounded-3xl border border-gray-700/30 p-8 shadow-xl">
      {/* Episodes Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Grid3X3 className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-xl font-semibold text-white">
            Episódios ({episodes.length})
          </h4>
        </div>
        
        {episodes.length > 3 && (
          <div className="text-sm text-gray-400">
            Mostrando {Math.min(displayedEpisodes.length, episodes.length)} de {episodes.length}
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedSeason}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {displayedEpisodes.map((episode) => (
            <EpisodeCard key={episode.number} episode={episode} />
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Show More/Less Episodes Button */}
      {episodes.length > 3 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pt-8"
        >
          <Button
            onClick={() => toggleExpandEpisodes(selectedSeason)}
            className="group bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-red-600/90 hover:to-red-700/90 border border-gray-700/50 hover:border-red-500/70 text-gray-300 hover:text-white rounded-2xl py-6 px-8 transition-all duration-300 shadow-lg hover:shadow-red-900/20"
          >
            {expandedEpisodes[selectedSeason] ? (
              <>
                <span className="font-medium">Mostrar menos</span>
                <ChevronDown className="ml-2 h-5 w-5 transition-transform group-hover:rotate-180 duration-300" />
              </>
            ) : (
              <>
                <span className="font-medium">Ver todos os {episodes.length} episódios</span>
                <Eye className="ml-2 h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default EpisodeList;
