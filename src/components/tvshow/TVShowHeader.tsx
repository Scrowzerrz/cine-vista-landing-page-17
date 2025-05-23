
import React from 'react';
import { Play, Plus, Share, Calendar, Star, Info, Tv } from 'lucide-react';
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
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-shrink-0"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl w-56 h-80 md:w-64 md:h-96 border-2 border-gray-700/50 hover:border-red-500/80 transition-all duration-500 transform hover:scale-[1.03] group">
          <img
            src={tvshow.poster}
            alt={tvshow.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-110 group-hover:contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Enhanced Badges */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute top-4 left-4"
          >
            <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold px-4 py-2 rounded-full shadow-xl backdrop-blur-sm border border-purple-400/30">
              <Tv className="w-4 h-4 mr-2" />
              SÉRIE
            </Badge>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute top-4 right-4"
          >
            <Badge className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold px-4 py-2 rounded-full shadow-xl backdrop-blur-sm border border-red-400/30">
              {tvshow.quality}
            </Badge>
          </motion.div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 bg-red-600/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-2 border-white/20"
            >
              <Play className="h-8 w-8 text-white ml-1" fill="white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Show Info */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-end"
      >
        <div className="space-y-8">
          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
            >
              {tvshow.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-300 text-lg md:text-xl font-medium tracking-wide"
            >
              {tvshow.originalTitle}
            </motion.p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring", bounce: 0.3 }}
              className="flex items-center bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300"
            >
              <Star className="h-5 w-5 text-yellow-400 mr-2 fill-yellow-400 drop-shadow-lg" />
              <span className="font-bold text-yellow-50 text-lg">{tvshow.rating}</span>
              <span className="text-yellow-200/80 ml-1">/10</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring", bounce: 0.3 }}
              className="flex items-center bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-gray-600/50 hover:border-blue-400/50 transition-all duration-300"
            >
              <Calendar className="w-5 h-5 mr-2 text-blue-400 drop-shadow-lg" /> 
              <span className="text-blue-50 font-bold text-lg">{tvshow.year}</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, type: "spring", bounce: 0.3 }}
              className="flex items-center bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-gray-600/50 hover:border-purple-400/50 transition-all duration-300"
            >
              <Info className="w-5 h-5 mr-2 text-purple-400 drop-shadow-lg" /> 
              <span className="text-purple-50 font-bold text-lg">{tvshow.seasons.length} Temporadas</span>
              <span className="text-purple-200/80 mx-2">•</span>
              <span className="text-purple-50 font-bold">{totalEpisodes} Episódios</span>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-7 px-10 rounded-full shadow-2xl border border-red-400/30 hover:shadow-red-500/40 hover:shadow-3xl transition-all duration-300 backdrop-blur-sm">
                <Play className="mr-3 h-6 w-6" fill="white" /> 
                <span className="font-black tracking-wide text-lg">ASSISTIR AGORA</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="outline" className="border-2 border-gray-500 hover:border-white/80 hover:bg-white/10 py-7 px-10 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl backdrop-blur-sm bg-gray-800/30">
                <Plus className="mr-3 h-6 w-6" /> 
                <span className="font-black tracking-wide text-lg">MINHA LISTA</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="outline" className="border-2 border-gray-500 hover:border-white/80 hover:bg-white/10 py-7 px-10 rounded-full shadow-xl transition-all duration-300 hover:shadow-2xl backdrop-blur-sm bg-gray-800/30">
                <Share className="mr-3 h-6 w-6" /> 
                <span className="font-black tracking-wide text-lg">COMPARTILHAR</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TVShowHeader;
