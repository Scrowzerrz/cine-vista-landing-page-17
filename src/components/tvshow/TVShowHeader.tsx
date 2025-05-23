
import React, { useState } from 'react';
import { Play, Plus, Share, Calendar, Star, Info, Clock, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import MoviePlayer from '../movie/MoviePlayer';
import { toast } from '@/hooks/use-toast';

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
  onWatchClick?: () => void;
}

const TVShowHeader: React.FC<TVShowHeaderProps> = ({ tvshow, onWatchClick }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const totalEpisodes = tvshow.seasons.reduce((total, season) => total + season.episodes.length, 0);
  
  // URL temporária do player
  const playerUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
  
  const handleAddToList = () => {
    toast({
      title: "Adicionado à sua lista",
      description: `${tvshow.title} foi adicionado à sua lista de favoritos.`,
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
  };

  const handleWatchClick = () => {
    if (onWatchClick) {
      onWatchClick();
    } else {
      setIsPlayerOpen(true);
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 w-full">
      {/* Show Poster */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex-shrink-0 mx-auto lg:mx-0"
      >
        <div className="relative rounded-3xl overflow-hidden shadow-2xl w-48 h-72 sm:w-56 sm:h-80 md:w-64 md:h-96 border-2 border-gray-700/50 hover:border-red-500/80 transition-all duration-500 transform hover:scale-[1.02] group">
          <img
            src={tvshow.poster}
            alt={tvshow.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
          />
          
          {/* Overlay with pulsing gradient */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{ 
              background: [
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent, transparent)",
                "linear-gradient(to top, rgba(0,0,0,0.8), rgba(239,68,68,0.1), transparent)",
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent, transparent)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Badges */}
          <motion.div 
            className="absolute top-3 left-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Badge className="bg-blue-600/90 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              SÉRIE
            </Badge>
          </motion.div>
          
          <motion.div 
            className="absolute top-3 right-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge className="bg-red-600/90 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
              {tvshow.quality}
            </Badge>
          </motion.div>
          
          {/* Play button overlay on hover */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              onClick={handleWatchClick}
              className="bg-red-600/90 hover:bg-red-700 text-white p-6 sm:p-8 lg:p-10 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110"
              whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8" fill="white" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Show Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col justify-center lg:justify-end flex-1"
      >
        <div className="space-y-4 sm:space-y-6">
          {/* Title and Original Title with Animation */}
          <div className="space-y-2 text-center lg:text-left">
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {tvshow.title}
              <motion.span 
                className="ml-2 inline-block w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.h1>
            <motion.p 
              className="text-gray-300 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {tvshow.originalTitle}
            </motion.p>
          </div>
          
          {/* Enhanced Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-yellow-500/30 hover:border-yellow-400/50 transition-all group"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-yellow-400" />
                <div className="text-center lg:text-left">
                  <div className="font-bold text-white text-sm sm:text-base">{tvshow.rating}</div>
                  <div className="text-xs text-yellow-200">IMDB</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-blue-500/30 hover:border-blue-400/50 transition-all group"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" />
                <div className="text-center lg:text-left">
                  <div className="font-bold text-white text-sm sm:text-base">{tvshow.year}</div>
                  <div className="text-xs text-blue-200">Período</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-green-500/30 hover:border-green-400/50 transition-all group"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                <div className="text-center lg:text-left">
                  <div className="font-bold text-white text-sm sm:text-base">{tvshow.seasons.length}</div>
                  <div className="text-xs text-green-200">Temporadas</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-lg border border-purple-500/30 hover:border-purple-400/50 transition-all group"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
                <div className="text-center lg:text-left">
                  <div className="font-bold text-white text-sm sm:text-base">{totalEpisodes}</div>
                  <div className="text-xs text-purple-200">Episódios</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Action Buttons with Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex-1 sm:flex-initial"
            >
              <Button 
                onClick={handleWatchClick}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 sm:py-6 px-6 sm:px-8 rounded-full shadow-xl transform transition-all hover:shadow-red-500/30 hover:shadow-2xl border border-red-500/20"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" fill="white" /> 
                <span className="font-bold tracking-wide text-sm sm:text-base">ASSISTIR AGORA</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex-1 sm:flex-initial"
            >
              <Button 
                variant="outline" 
                onClick={handleAddToList}
                className="w-full sm:w-auto border-gray-600 hover:bg-gray-700/80 py-4 sm:py-6 px-4 sm:px-8 rounded-full shadow-lg transition-all hover:border-white/70 hover:text-white backdrop-blur-sm bg-gray-800/30"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="font-bold tracking-wide text-sm sm:text-base">MINHA LISTA</span>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="flex-1 sm:flex-initial"
            >
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="w-full sm:w-auto border-gray-600 hover:bg-gray-700/80 py-4 sm:py-6 px-4 sm:px-8 rounded-full shadow-lg transition-all hover:border-white/70 hover:text-white backdrop-blur-sm bg-gray-800/30"
              >
                <Share className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="font-bold tracking-wide text-sm sm:text-base">COMPARTILHAR</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Player Modal */}
      <MoviePlayer
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        playerUrl={playerUrl}
        title={tvshow.title}
      />
    </div>
  );
};

export default TVShowHeader;
