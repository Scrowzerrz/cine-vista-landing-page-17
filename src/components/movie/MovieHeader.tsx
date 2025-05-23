
import React from 'react';
import { Play, ListPlus, Share, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface MovieHeaderProps {
  movie: {
    title: string;
    originalTitle: string;
    poster: string;
    year: string;
    duration: string;
    rating: string;
    quality: string;
  };
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ movie }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-8 w-full"
    >
      {/* Movie Poster */}
      <div className="flex-shrink-0">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl w-56 h-80 md:w-64 md:h-96 border-2 border-gray-700/50 group">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-blue-600/90 hover:bg-blue-600 border-0 px-3 py-1 rounded-full text-sm font-medium">LEG</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-red-600/90 hover:bg-red-600 border-0 px-3 py-1 rounded-full text-sm font-medium shadow-lg">{movie.quality}</Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
      
      {/* Movie Info */}
      <div className="flex flex-col justify-end">
        <div className="space-y-5">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{movie.title}</h1>
            <p className="text-gray-400 text-sm md:text-base italic">{movie.originalTitle}</p>
          </div>
          
          <div className="flex items-center space-x-4 bg-gray-800/40 rounded-xl p-3 backdrop-blur-sm w-fit">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-yellow-400 font-medium">{movie.rating}</span>
              <span className="text-gray-400">/10</span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">{movie.year}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-300">{movie.duration}</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-6 h-auto shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" fill="white" /> 
              <span>ASSISTIR AGORA</span>
            </Button>
            
            {/* Fixed buttons with proper styling */}
            <Button 
              variant="outline" 
              className="border border-gray-600 bg-gray-800/50 hover:bg-gray-700 text-white rounded-xl px-5 py-6 h-auto shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ListPlus className="mr-2 h-5 w-5" /> 
              <span>Minha Lista</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="border border-gray-600 bg-gray-800/50 hover:bg-gray-700 text-white rounded-xl px-5 py-6 h-auto shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Share className="mr-2 h-5 w-5" /> 
              <span>Compartilhar</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieHeader;
