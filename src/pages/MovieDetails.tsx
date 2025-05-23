
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieHeader from '@/components/movie/MovieHeader';
import MovieInfo from '@/components/movie/MovieInfo';
import RelatedMovies from '@/components/movie/RelatedMovies';
import Comments from '@/components/movie/Comments';
import { motion } from 'framer-motion';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);
  
  // Simulação de dados de filme (em produção, isso viria de uma API ou Supabase)
  const movie = {
    id: id || '1',
    title: 'MISSÃO: IMPOSSÍVEL - O ACERTO FINAL',
    originalTitle: 'Mission: Impossible - The Final Reckoning',
    year: '2023',
    duration: '169min',
    rating: '7.7',
    poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYUkEgdZe.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg',
    quality: 'CAM',
    categories: ['Ação', 'Aventura', 'Suspense'],
    director: 'Christopher McQuarrie',
    cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg', 'Esai Morales'],
    producer: 'Paramount Pictures, Skydance Media, TC Productions',
    plot: 'Depois de escapar de um acidente de trem calamitoso, Ethan percebe que a entidade está escondida a bordo de um antigo submarino russo, mas um inimigo do seu passado está determinado a garantir que, desta vez, Ethan não interferirá nos seus planos.',
  };

  const relatedMovies = [
    {
      id: '2',
      title: '007: Nunca Mais Outra Vez',
      year: '1983',
      duration: '134min',
      image: 'https://image.tmdb.org/t/p/w500/wBpN7dIZpL5xLva0qH6DYzXjBdI.jpg',
      quality: 'HD',
      type: 'LEG'
    },
    {
      id: '3',
      title: 'O Banqueiro',
      year: '2020',
      duration: '120min',
      image: 'https://image.tmdb.org/t/p/w500/biznhvfediHgKi5zH3lOoS8ASXL.jpg',
      quality: 'HD',
      type: 'DUB'
    },
    {
      id: '4',
      title: 'John Wick 3: Parabellum',
      year: '2019',
      duration: '130min',
      image: 'https://image.tmdb.org/t/p/w500/mOoERCQCGrgFHOrco7wLy0mDoAX.jpg',
      quality: 'HD',
      type: 'DUB'
    },
    {
      id: '5',
      title: 'Amor e Monstros',
      year: '2020',
      duration: '109min',
      image: 'https://image.tmdb.org/t/p/w500/hnz5wRqeYKlugGbC7RZxC7DAiED.jpg',
      quality: 'HD',
      type: 'DUB'
    },
    {
      id: '6',
      title: 'Os Pequenos Vestígios',
      year: '2021',
      duration: '128min',
      image: 'https://image.tmdb.org/t/p/w500/98UFAKFPUOIzF91Q0j0W7vR4ikV.jpg',
      quality: 'HD',
      type: 'DUB'
    }
  ];

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
          {/* Improved gradient overlay for better text visibility and smoother transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/70 to-gray-950 backdrop-blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
            <MovieHeader movie={movie} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12 -mt-6 relative z-10">
          <div className="grid grid-cols-1 gap-12">
            <div>
              {/* Movie Info */}
              <MovieInfo movie={movie} />
            </div>
            
            {/* Related Movies */}
            <div>
              <RelatedMovies movies={relatedMovies} />
            </div>
            
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
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
