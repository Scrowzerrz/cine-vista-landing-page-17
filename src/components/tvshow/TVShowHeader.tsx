
import React from 'react';
import { Play, Plus, Share, Calendar, Star, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      <div className="flex-shrink-0 animate-fade-in">
        <div className="relative rounded-lg overflow-hidden shadow-2xl w-56 h-80 md:w-64 md:h-96 border-2 border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-[1.02] group">
          <img
            src={tvshow.poster}
            alt={tvshow.title}
            className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-600 text-white font-medium px-2.5 py-1 rounded-md shadow-lg">SÉRIE</Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-600 text-white font-medium px-2.5 py-1 rounded-md shadow-lg">{tvshow.quality}</Badge>
          </div>
        </div>
      </div>
      
      {/* Show Info */}
      <div className="flex flex-col justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">{tvshow.title}</h1>
            <p className="text-gray-400 text-sm md:text-base">{tvshow.originalTitle}</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center bg-gray-800/60 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
              <span className="font-medium text-yellow-50">{tvshow.rating}/10</span>
            </div>
            <div className="flex items-center bg-gray-800/60 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
              <Calendar className="w-4 h-4 mr-1 text-blue-400" /> 
              <span className="text-blue-50">{tvshow.year}</span>
            </div>
            <div className="flex items-center bg-gray-800/60 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
              <Info className="w-4 h-4 mr-1 text-purple-400" /> 
              <span className="text-purple-50">{tvshow.seasons.length} Temporadas • {totalEpisodes} Episódios</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button className="bg-red-600 hover:bg-red-700 text-white py-6 px-6 rounded-full shadow-lg transform hover:translate-y-[-2px] transition-all hover:shadow-red-500/30 hover:shadow-xl">
              <Play className="mr-2 h-5 w-5" fill="white" /> 
              <span className="font-medium">ASSISTIR AGORA</span>
            </Button>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700/80 py-6 px-6 rounded-full shadow-md transition-all hover:border-white hover:text-white">
              <Plus className="mr-2 h-5 w-5" /> 
              <span className="font-medium">MINHA LISTA</span>
            </Button>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700/80 py-6 px-6 rounded-full shadow-md transition-all hover:border-white hover:text-white">
              <Share className="mr-2 h-5 w-5" /> 
              <span className="font-medium">COMPARTILHAR</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowHeader;
