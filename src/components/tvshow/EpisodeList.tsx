
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye, Play, Clock, Calendar } from 'lucide-react';
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <motion.div className="space-y-6 sm:space-y-8">
      {/* Episodes Header */}
      <motion.div 
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
            <Play className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Episódios da Temporada {selectedSeason}</h3>
            <p className="text-gray-400 text-sm">{episodes.length} episódios disponíveis</p>
          </div>
        </div>
        
        {/* Episode Stats */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700/50">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">Temporada {selectedSeason}</span>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700/50">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-green-400" />
              <span className="text-gray-300">{episodes.length} eps</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Episodes Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${selectedSeason}-${expandedEpisodes[selectedSeason]}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:gap-6"
        >
          {displayedEpisodes.map((episode, index) => (
            <motion.div
              key={episode.number}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 24
                  }
                }
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <EpisodeCard episode={episode} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      {/* Show More/Less Episodes Button */}
      {episodes.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center pt-4"
        >
          <Button
            onClick={() => toggleExpandEpisodes(selectedSeason)}
            variant="outline"
            className="relative overflow-hidden border-2 border-gray-700/50 hover:border-red-500/70 bg-gradient-to-r from-gray-800/40 to-gray-900/40 hover:from-gray-800/70 hover:to-gray-900/70 text-gray-300 hover:text-white rounded-2xl py-6 sm:py-8 px-8 sm:px-12 transition-all group backdrop-blur-sm"
          >
            {/* Background animation */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-500/10 to-red-600/0"
              animate={{ 
                x: ['-100%', '100%'],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatType: "loop" 
              }}
            />
            
            <div className="relative z-10 flex items-center gap-3">
              {expandedEpisodes[selectedSeason] ? (
                <>
                  <ChevronDown className="h-5 w-5 transition-transform group-hover:scale-110 group-hover:-translate-y-1" />
                  <span className="font-semibold text-base sm:text-lg">Mostrar menos episódios</span>
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-base sm:text-lg">
                    Ver todos os {episodes.length} episódios
                  </span>
                  <motion.div
                    className="bg-red-600 text-white text-xs px-2 py-1 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    +{episodes.length - 3}
                  </motion.div>
                </>
              )}
            </div>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EpisodeList;
