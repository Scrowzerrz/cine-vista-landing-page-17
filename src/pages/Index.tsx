
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ContentCarouselWrapper from '../components/ContentCarouselWrapper';
import MovieCategories from '../components/MovieCategories';
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
      contentType: "tvshow" as "tvshow"
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      
      <main className="relative">
        <HeroSection />
        
        {/* Content Sections with Enhanced Animations */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative z-10 bg-gradient-to-b from-transparent via-black/50 to-black"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 py-16 space-y-16 max-w-7xl relative">
            {/* Categories Section */}
            <motion.div variants={sectionVariants} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-black/20 rounded-3xl border border-gray-800/50 p-8 shadow-2xl">
                <MovieCategories />
              </div>
            </motion.div>

            {/* Movies Section */}
            <motion.div variants={sectionVariants} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-black/20 rounded-3xl border border-gray-800/50 p-8 shadow-2xl">
                {isLoadingMovies ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-64 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
                      />
                      <span className="text-gray-400">Carregando filmes...</span>
                    </div>
                  </motion.div>
                ) : (
                  <ContentCarouselWrapper 
                    title="Filmes" 
                    data={moviesData}
                    categories={["LANÇAMENTOS", "MAIS VISTOS", "EM ALTA", "RECOMENDADOS"]}
                    contentType="movie"
                  />
                )}
              </div>
            </motion.div>
            
            {/* Series Section */}
            <motion.div variants={sectionVariants} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-black/20 rounded-3xl border border-gray-800/50 p-8 shadow-2xl">
                <ContentCarouselWrapper 
                  title="Séries" 
                  data={seriesData}
                  categories={["NOVOS EPISÓDIOS", "MAIS VISTAS", "EM ALTA", "RECOMENDADAS"]}
                  contentType="tvshow"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
