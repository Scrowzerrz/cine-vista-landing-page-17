
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieHeader from '@/components/movie/MovieHeader';
import MovieInfo from '@/components/movie/MovieInfo';
import RelatedMovies from '@/components/movie/RelatedMovies';
import Comments from '@/components/movie/Comments';
import { getMovieById } from '@/services/movieService';
import { MovieWithRelations } from '@/types/movie';
import MoviePlayer from '@/components/movie/MoviePlayer';
import { useAuth } from '@/contexts/AuthContext';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { loading: authLoading } = useAuth();
  
  const { data: movie, isLoading, error } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => getMovieById(id || ''),
    enabled: !!id && !authLoading,
  });
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Filme não encontrado</h2>
          <p>Desculpe, não conseguimos encontrar o filme que você está procurando.</p>
        </div>
      </div>
    );
  }

  // Prepare related movies data for the RelatedMovies component
  const relatedMoviesFormatted = movie.related_movies?.map(relatedMovie => ({
    id: relatedMovie.id,
    title: relatedMovie.title,
    year: relatedMovie.year,
    duration: relatedMovie.duration,
    image: relatedMovie.poster,
    quality: relatedMovie.quality,
    type: 'DUB', // Fixo por enquanto, poderia vir do banco em uma implementação futura
  })) || [];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Movie Background with improved Gradient Overlay */}
        <div 
          className="relative w-full h-[500px] md:h-[600px] lg:h-[80vh] bg-cover bg-center transition-all duration-700 overflow-hidden"
          style={{ 
            backgroundImage: `url(${movie.backdrop})`, 
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: '50% 0%',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/70 to-gray-950 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
            <MovieHeader 
              movie={movie} 
              onPlayClick={() => setIsPlayerOpen(true)} 
            />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 -mt-6 relative z-10">
          <div className="grid grid-cols-1 gap-12">
            <div>
              {/* Movie Info */}
              <MovieInfo movie={movie} />
            </div>
            
            {/* Related Movies */}
            {relatedMoviesFormatted.length > 0 && (
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <RelatedMovies movies={relatedMoviesFormatted} />
                </motion.div>
              </div>
            )}
            
            {/* Comments Section */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="backdrop-blur-sm bg-gray-800/40 rounded-3xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <Comments />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Movie Player Modal */}
      <MoviePlayer 
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        playerUrl={movie.player_url}
        title={movie.title}
      />
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
