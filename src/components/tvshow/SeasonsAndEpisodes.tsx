
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Tv } from 'lucide-react';
import SeasonSelector from './SeasonSelector';
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
      className="mt-12 backdrop-blur-sm bg-gray-800/40 rounded-3xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-bold flex items-center text-white"
        >
          <div className="mr-4 p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg shadow-red-500/30">
            <Play className="h-7 w-7 text-white" fill="white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-300">
            Temporadas e Episódios
          </span>
        </motion.h3>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center gap-6"
        >
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-800/60 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-400" />
                <span className="text-gray-300">
                  <span className="text-red-400 font-semibold">{seasons.length}</span> Temporadas
                </span>
              </div>
              <div className="w-1 h-4 bg-gray-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">
                  <span className="text-blue-400 font-semibold">{
                    seasons.reduce((total, season) => total + season.episodes.length, 0)
                  }</span> Episódios
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Season Selector */}
      <SeasonSelector 
        seasons={seasons} 
        selectedSeason={selectedSeason} 
        setSelectedSeason={setSelectedSeason} 
      />
      
      {/* Current Season Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex items-center justify-between p-4 bg-gradient-to-r from-red-900/30 to-red-800/20 rounded-2xl border border-red-700/30"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">{currentSeason.number}</span>
          </div>
          <div>
            <h4 className="text-white font-semibold text-lg">Temporada {currentSeason.number}</h4>
            <p className="text-red-300 text-sm">{currentSeason.year} • {currentSeason.episodes.length} episódios</p>
          </div>
        </div>
      </motion.div>
      
      {/* Episode List */}
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
