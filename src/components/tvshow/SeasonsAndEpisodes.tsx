
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SeasonSelector from './SeasonSelector';
import SeasonInfo from './SeasonInfo';
import EpisodeList from './EpisodeList';

interface SeasonsAndEpisodesProps {
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
  expandedEpisodes: Record<string, boolean>;
  toggleExpandEpisodes: (seasonNumber: string) => void;
}

const SeasonsAndEpisodes: React.FC<SeasonsAndEpisodesProps> = ({
  seasons,
  selectedSeason,
  setSelectedSeason,
  expandedEpisodes,
  toggleExpandEpisodes
}) => {
  // Encontre a temporada selecionada
  const currentSeason = seasons.find(season => season.number.toString() === selectedSeason);
  
  return (
    <motion.div 
      className="mt-8 sm:mt-12 lg:mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span 
          className="inline-block w-1 h-6 sm:h-8 bg-red-600 mr-2 sm:mr-3 rounded-full"
          initial={{ height: 0 }}
          animate={{ height: "2rem" }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
        EPISÓDIOS
      </motion.h2>
      
      {/* Season Selector */}
      <SeasonSelector
        seasons={seasons}
        selectedSeason={selectedSeason}
        setSelectedSeason={setSelectedSeason}
      />
      
      {/* Season Info */}
      {currentSeason && (
        <AnimatePresence>
          <motion.div
            key={selectedSeason}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <SeasonInfo season={currentSeason} />
            
            <EpisodeList
              episodes={currentSeason.episodes}
              selectedSeason={selectedSeason}
              expandedEpisodes={expandedEpisodes}
              toggleExpandEpisodes={toggleExpandEpisodes}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default SeasonsAndEpisodes;
