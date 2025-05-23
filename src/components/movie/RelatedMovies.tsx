
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full backdrop-blur-sm bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center">
          <span className="inline-block w-1 h-5 bg-red-600 mr-2"></span>
          FILMES RELACIONADOS
        </h2>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="border-gray-700 bg-gray-800/50 hover:bg-red-600 transition-colors">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <Button variant="outline" size="icon" className="border-gray-700 bg-gray-800/50 hover:bg-red-600 transition-colors">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie, index) => (
          <motion.div 
            key={movie.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="relative group cursor-pointer"
            onClick={() => handleMovieClick(movie.id)}
          >
            <div className="relative overflow-hidden rounded-lg bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
              <img 
                src={movie.image}
                alt={movie.title}
                className="w-full h-56 object-cover group-hover:scale-105 group-hover:opacity-80 transition-all duration-300"
              />
              <div className="absolute top-2 left-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${movie.type === 'DUB' ? 'bg-blue-600/60 text-blue-100 border-blue-800' : 'bg-blue-500/60 text-blue-100 border-blue-700'}`}
                >
                  {movie.type}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gray-700/80 text-gray-200 border-gray-600"
                >
                  {movie.quality}
                </Badge>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-3">
                <h3 className="text-sm font-medium text-white line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  {movie.year} • {movie.duration}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedMovies;
