
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ContentCarouselWrapper from '../components/ContentCarouselWrapper';
import Footer from '../components/Footer';
import { getHomePageMovies } from '@/services/homeService';

const Index = () => {
  const { data: moviesData = [], isLoading: isLoadingMovies } = useQuery({
    queryKey: ['homePageMovies'],
    queryFn: getHomePageMovies
  });

  const seriesData = [
    {
      id: "1",
      title: "The Last of Us",
      year: "2023",
      duration: "S1 E9",
      image: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7tKqQR.jpg",
      quality: "4K",
      type: "DUB",
      contentType: "tvshow" as "tvshow"  // Explicitly cast as the literal type
    },
    {
      id: "2",
      title: "Wandinha",
      year: "2022",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/ooBR3q49rorFe72OiAyH3W9Xhcb.jpg",
      quality: "FULLHD",
      type: "DUB",
      contentType: "tvshow" as "tvshow"
    },
    {
      id: "3",
      title: "The Mandalorian",
      year: "2023",
      duration: "S3 E8",
      image: "https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg",
      quality: "4K",
      type: "LEG",
      contentType: "tvshow" as "tvshow"
    },
    {
      id: "4",
      title: "Succession",
      year: "2023",
      duration: "S4 E10",
      image: "https://image.tmdb.org/t/p/w500/x5tY3UEKSeS7K2EML0zJcR0aN2r.jpg",
      quality: "FULLHD",
      type: "LEG",
      contentType: "tvshow" as "tvshow"
    },
    {
      id: "5",
      title: "Loki",
      year: "2023",
      duration: "S2 E6",
      image: "https://image.tmdb.org/t/p/w500/voHU2TwK2x355TzT5v3QvfC54g.jpg",
      quality: "4K",
      type: "DUB",
      contentType: "tvshow" as "tvshow"
    },
    {
      id: "6",
      title: "Ahsoka",
      year: "2023",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/laN1B5S4FX8b99Vd6n272YOvzo9.jpg",
      quality: "FULLHD",
      type: "DUB",
      contentType: "tvshow" as "tvshow"
    },
    {
      id: "7",
      title: "Gen V",
      year: "2023",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/sH32Tf9UBxM2Q0adq2jP0nPU27q.jpg",
      quality: "4K",
      type: "LEG",
      contentType: "tvshow" as "tvshow"
    }
  ];

  return (
    <div className="min-h-screen bg-black/95 text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12 space-y-12 max-w-7xl"> 
          {isLoadingMovies ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : (
            <ContentCarouselWrapper 
              title="Filmes" 
              data={moviesData}
              categories={["LANÇAMENTOS", "MAIS VISTOS", "EM ALTA", "RECOMENDADOS"]}
              contentType="movie"
            />
          )}
          
          <ContentCarouselWrapper 
            title="Séries" 
            data={seriesData}
            categories={["NOVOS EPISÓDIOS", "MAIS VISTAS", "EM ALTA", "RECOMENDADAS"]}
            contentType="tvshow"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
