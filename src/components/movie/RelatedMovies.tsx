
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, FilmIcon, Play, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Movie {
  id: string;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
}

interface RelatedMoviesProps {
  movies: Movie[];
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({ movies }) => {
  const navigate = useNavigate();
  
  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (movies.length === 0) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full backdrop-blur-sm bg-gray-800/40 rounded-3xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold flex items-center text-white">
          <FilmIcon className="w-6 h-6 text-red-500 mr-3" />
          <span className="inline-block w-1 h-6 bg-red-600 mr-3 rounded-full"></span>
          FILMES RELACIONADOS
        </h2>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="icon" 
            className="border border-gray-600 bg-gray-800/70 hover:bg-red-600 hover:border-red-600 transition-all duration-300 rounded-full w-10 h-10 shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="border border-gray-600 bg-gray-800/70 hover:bg-red-600 hover:border-red-600 transition-all duration-300 rounded-full w-10 h-10 shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie, index) => (
          <motion.div 
            key={movie.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="relative group cursor-pointer"
            onClick={() => handleMovieClick(movie.id)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-800 border-2 border-gray-700/30 hover:border-red-500/70 shadow-lg hover:shadow-red-600/20 transition-all duration-300 h-full transform hover:translate-y-[-5px]">
              <div className="aspect-[2/3] overflow-hidden">
                <img 
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:opacity-80 transition-all duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="absolute top-3 left-3">
                <Badge 
                  className="text-xs font-medium bg-blue-600/90 text-blue-50 border-0 rounded-full px-2.5 py-0.5 shadow-lg"
                >
                  {movie.type}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <Badge 
                  className="text-xs font-medium bg-red-600/90 text-gray-100 border-0 rounded-full px-2.5 py-0.5 shadow-lg"
                >
                  {movie.quality}
                </Badge>
              </div>
              
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-red-400 transition-colors">
                  {movie.title}
                </h3>
                
                <div className="flex items-center mt-2 space-x-2 text-xs text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 text-red-500 mr-1" />
                    {movie.year}
                  </div>
                  <span className="text-gray-500">•</span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 text-red-500 mr-1" />
                    {movie.duration}
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-red-600/90 hover:bg-red-600 rounded-full flex items-center justify-center shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                  <Play className="h-7 w-7 text-white" fill="white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedMovies;
