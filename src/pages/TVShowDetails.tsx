
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TVShowHeader from '@/components/tvshow/TVShowHeader';
import TVShowInfo from '@/components/tvshow/TVShowInfo';
import RelatedShows from '@/components/tvshow/RelatedShows';
import Comments from '@/components/movie/Comments';
import SeasonsAndEpisodes from '@/components/tvshow/SeasonsAndEpisodes';
import { motion } from 'framer-motion';
import { getTVShowDetails, getRelatedTVShows } from '@/services/tvshowService';

const TVShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSeason, setSelectedSeason] = useState("1");
  const [expandedEpisodes, setExpandedEpisodes] = useState<Record<string, boolean>>({});
  
  const { data: tvshow, isLoading: isLoadingTVShow } = useQuery({
    queryKey: ['tvshow', id],
    queryFn: () => getTVShowDetails(id!),
    enabled: !!id
  });

  const { data: relatedShows = [] } = useQuery({
    queryKey: ['relatedTVShows', id],
    queryFn: () => getRelatedTVShows(id!),
    enabled: !!id
  });

  // Toggle expanded episodes state
  const toggleExpandEpisodes = (seasonNumber: string) => {
    setExpandedEpisodes(prev => ({
      ...prev,
      [seasonNumber]: !prev[seasonNumber]
    }));
  };

  if (isLoadingTVShow) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white flex items-center justify-center">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
          />
          <span className="text-gray-400">Carregando série...</span>
        </motion.div>
      </div>
    );
  }

  if (!tvshow) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Série não encontrada</h1>
          <p className="text-gray-400">A série solicitada não foi encontrada.</p>
        </div>
      </div>
    );
  }

  // Converter dados para o formato esperado pelos componentes
  const formattedTVShow = {
    title: tvshow.title,
    originalTitle: tvshow.original_title || tvshow.title,
    poster: tvshow.poster,
    year: tvshow.year,
    rating: tvshow.rating,
    quality: tvshow.quality,
    seasons: tvshow.seasons.map(season => ({
      number: season.season_number,
      year: season.year,
      episodes: season.episodes.map(episode => ({
        number: episode.episode_number,
        title: episode.title,
        runtime: episode.runtime,
        overview: episode.overview,
        image: episode.poster
      }))
    }))
  };

  const formattedTVShowInfo = {
    plot: tvshow.plot,
    categories: tvshow.categories.map(c => c.name),
    creator: tvshow.creator || 'Não informado',
    cast: tvshow.actors.map(a => a.name),
    network: tvshow.network || 'Não informado'
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Show Background with Gradient Overlay */}
        <div 
          className="relative w-full h-[500px] md:h-[600px] lg:h-[70vh] bg-cover bg-center bg-fixed transition-all duration-700"
          style={{ 
            backgroundImage: `url(${tvshow.backdrop})`, 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/80 to-gray-950"></div>
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
            <TVShowHeader tvshow={formattedTVShow} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-3">
              {/* TV Show Info */}
              <TVShowInfo tvshow={formattedTVShowInfo} />
              
              {/* Seasons and Episodes */}
              <SeasonsAndEpisodes 
                seasons={formattedTVShow.seasons}
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
                expandedEpisodes={expandedEpisodes}
                toggleExpandEpisodes={toggleExpandEpisodes}
              />
              
              {/* Related TV Shows */}
              {relatedShows.length > 0 && (
                <div className="mt-12">
                  <RelatedShows shows={relatedShows} />
                </div>
              )}
              
              {/* Comments Section */}
              <div className="mt-12">
                <Comments />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TVShowDetails;
