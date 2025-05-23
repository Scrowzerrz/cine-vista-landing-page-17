
import React from 'react';
import { Play, Plus, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Movie Poster */}
      <div className="flex-shrink-0">
        <div className="relative rounded-lg overflow-hidden shadow-2xl w-56 h-80 md:w-64 md:h-96 border-2 border-gray-700">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-600 text-white font-medium">LEG</Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-600 text-white font-medium">{movie.quality}</Badge>
          </div>
        </div>
      </div>
      
      {/* Movie Info */}
      <div className="flex flex-col justify-end">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{movie.title}</h1>
            <p className="text-gray-400 text-sm md:text-base">{movie.originalTitle}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg 
                  key={index}
                  className={`w-4 h-4 ${index < Math.floor(parseFloat(movie.rating) / 2) ? 'text-yellow-400' : 'text-gray-600'}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 20"
                >
                  <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                </svg>
              ))}
              <span className="ml-2 text-gray-300">{movie.rating}/10</span>
            </div>
            <span className="text-gray-400">|</span>
            <span>{movie.year}</span>
            <span className="text-gray-400">|</span>
            <span>{movie.duration}</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Play className="mr-2 h-4 w-4" /> 
              <span>PLAY</span>
              <span className="hidden md:inline ml-1">Clique e assista</span>
            </Button>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700/50">
              <Plus className="mr-2 h-4 w-4" /> 
              Minha Lista
            </Button>
            <Button variant="outline" className="border-gray-600 hover:bg-gray-700/50">
              <Share className="mr-2 h-4 w-4" /> 
              Compartilhar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHeader;
