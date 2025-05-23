
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MovieHeader from '@/components/movie/MovieHeader';
import MovieInfo from '@/components/movie/MovieInfo';
import RelatedMovies from '@/components/movie/RelatedMovies';
import Comments from '@/components/movie/Comments';
import { Button } from '@/components/ui/button';
import { Play, Plus, Share } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  
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
    links: [
      { label: 'Assistir Mission: Impossible - O Acerto Final Online Dublado', type: 'DUB' },
      { label: 'Assistir Mission: Impossible - O Acerto Final Online Legendado', type: 'LEG' },
      { label: 'Assistir Mission: Impossible - O Acerto Final Online em HD', type: 'HD' },
      { label: 'Assistir Mission: Impossible - O Acerto Final Online Grátis', type: 'FREE' },
    ]
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
    <div className="bg-gray-900 min-h-screen text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Movie Background with Gradient Overlay */}
        <div 
          className="relative w-full h-[500px] md:h-[600px] lg:h-[70vh] bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${movie.backdrop})`, 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-gray-900/70 to-gray-900"></div>
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
            <MovieHeader movie={movie} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              {/* Movie Info */}
              <MovieInfo movie={movie} />
              
              {/* Stream Options */}
              <div className="mt-8 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold mb-4">Opções para Assistir</h3>
                
                <div className="space-y-3">
                  {movie.links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                      <span className="text-gray-300">{link.label}</span>
                      <Button variant="default" className="bg-red-600 hover:bg-red-700">
                        <Play className="mr-2 h-4 w-4" /> Assistir
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Related Movies */}
              <div className="mt-8">
                <RelatedMovies movies={relatedMovies} />
              </div>
              
              {/* Comments Section */}
              <div className="mt-8">
                <Comments />
              </div>
            </div>
            
            {/* Sidebar with Related Content */}
            <div className="md:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 sticky top-20">
                <h3 className="text-lg font-bold mb-4">Recomendações</h3>
                
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4 pr-4">
                    {relatedMovies.map((movie) => (
                      <div key={movie.id} className="flex space-x-3">
                        <img 
                          src={movie.image} 
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-md"
                        />
                        <div className="flex flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-sm leading-tight">{movie.title}</h4>
                            <p className="text-xs text-gray-400">{movie.year} • {movie.duration}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Badge variant="outline" className="text-[10px] h-4 bg-gray-700/70 border-gray-600">
                              {movie.quality}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] h-4 bg-blue-600/20 text-blue-400 border-blue-800">
                              {movie.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetails;
