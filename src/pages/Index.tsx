
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ContentCarouselWrapper from '../components/ContentCarouselWrapper';
import Footer from '../components/Footer';
import { getHomePageMovies } from '@/services/homeService';
import { getHomepageTVShows } from '@/services/tvshowService';

const Index = () => {
  const { data: moviesData = [], isLoading: isLoadingMovies } = useQuery({
    queryKey: ['homePageMovies'],
    queryFn: getHomePageMovies
  });

  const { data: seriesData = [], isLoading: isLoadingSeries } = useQuery({
    queryKey: ['homepageTVShows'],
    queryFn: getHomepageTVShows
  });

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
                {isLoadingSeries ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-64 flex items-center justify-center"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                      />
                      <span className="text-gray-400">Carregando séries...</span>
                    </div>
                  </motion.div>
                ) : (
                  <ContentCarouselWrapper 
                    title="Séries" 
                    data={seriesData}
                    categories={["NOVOS EPISÓDIOS", "MAIS VISTAS", "EM ALTA", "RECOMENDADAS"]}
                    contentType="tvshow"
                  />
                )}
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
