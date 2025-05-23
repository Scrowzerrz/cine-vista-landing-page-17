
import React from 'react';
import { Play, Plus, Share, Calendar, Star, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TVShowHeaderProps {
  tvshow: {
    title: string;
    originalTitle: string;
    poster: string;
    year: string;
    rating: string;
    quality: string;
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
  };
}

const TVShowHeader: React.FC<TVShowHeaderProps> = ({ tvshow }) => {
  const totalEpisodes = tvshow.seasons.reduce((total, season) => total + season.episodes.length, 0);
  
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Show Poster */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-shrink-0"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl w-56 h-80 md:w-64 md:h-96 border-2 border-gray-700/50 hover:border-red-500/80 transition-all duration-300 transform hover:scale-[1.02] group">
          <img
            src={tvshow.poster}
            alt={tvshow.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600/90 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">SÉRIE</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-600/90 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">{tvshow.quality}</Badge>
          </div>
        </div>
      </motion.div>
      
      {/* Show Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col justify-end"
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">{tvshow.title}</h1>
            <p className="text-gray-300 text-sm md:text-base">{tvshow.originalTitle}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center bg-gray-900/70 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg border border-gray-700/50"
            >
              <Star className="h-4 w-4 text-yellow-400 mr-1.5 fill-yellow-400" />
              <span className="font-medium text-yellow-50">{tvshow.rating}/10</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex items-center bg-gray-900/70 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg border border-gray-700/50"
            >
              <Calendar className="w-4 h-4 mr-1.5 text-blue-400" /> 
              <span className="text-blue-50">{tvshow.year}</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex items-center bg-gray-900/70 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg border border-gray-700/50"
            >
              <Info className="w-4 h-4 mr-1.5 text-purple-400" /> 
              <span className="text-purple-50">{tvshow.seasons.length} Temporadas • {totalEpisodes} Episódios</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Button className="bg-red-600 hover:bg-red-700 text-white py-6 px-8 rounded-full shadow-xl transform hover:-translate-y-1 transition-all hover:shadow-red-500/30 hover:shadow-2xl border border-red-500/20">
              <Play className="mr-2 h-5 w-5" fill="white" /> 
              <span className="font-bold tracking-wide">ASSISTIR AGORA</span>
            </Button>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700/80 py-6 px-8 rounded-full shadow-lg transition-all hover:border-white/70 hover:text-white backdrop-blur-sm bg-gray-800/30">
              <Plus className="mr-2 h-5 w-5" /> 
              <span className="font-bold tracking-wide">MINHA LISTA</span>
            </Button>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700/80 py-6 px-8 rounded-full shadow-lg transition-all hover:border-white/70 hover:text-white backdrop-blur-sm bg-gray-800/30">
              <Share className="mr-2 h-5 w-5" /> 
              <span className="font-bold tracking-wide">COMPARTILHAR</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TVShowHeader;
