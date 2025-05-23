
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
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
  const currentSeason = seasons.find(season => season.number.toString() === selectedSeason) || seasons[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-12 bg-gray-900/60 backdrop-blur-lg p-8 rounded-[2rem] border border-gray-700/50 shadow-[0_0_45px_-15px_rgba(0,0,0,0.5)]"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <h3 className="text-3xl font-bold flex items-center">
          <div className="mr-4 p-2 bg-red-600 rounded-xl shadow-lg shadow-red-500/20">
            <Play className="h-6 w-6" fill="white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">Temporadas e Episódios</span>
        </h3>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-gray-800/70 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-gray-700/50 shadow-lg"
        >
          <p className="text-gray-300 font-medium">
            <span className="text-red-400 font-semibold">{seasons.length}</span> Temporadas • <span className="text-red-400 font-semibold">{
            seasons.reduce((total, season) => total + season.episodes.length, 0)
          }</span> Episódios
          </p>
        </motion.div>
      </div>
      
      <SeasonSelector 
        seasons={seasons} 
        selectedSeason={selectedSeason} 
        setSelectedSeason={setSelectedSeason} 
      />
      
      <SeasonInfo season={currentSeason} />
      
      <EpisodeList 
        episodes={currentSeason.episodes} 
        selectedSeason={selectedSeason} 
        expandedEpisodes={expandedEpisodes} 
        toggleExpandEpisodes={toggleExpandEpisodes} 
      />
    </motion.div>
  );
};

export default SeasonsAndEpisodes;
