
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, ChevronDown, Share, CalendarIcon, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import MoviePlayer from '@/components/movie/MoviePlayer';

interface EpisodeCardProps {
  episode: {
    number: number;
    title: string;
    runtime: string;
    overview: string;
    image: string;
  };
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handlePlayClick = () => {
    setIsPlayerOpen(true);
  };
  
  // URL de exemplo para o player
  const playerUrl = `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`;
  
  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1]
            } 
          }
        }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="overflow-hidden rounded-3xl border border-gray-700/30 transition-all duration-500 hover:border-red-500/50 shadow-lg hover:shadow-red-900/10 hover:shadow-xl group"
      >
        <div className="relative w-full h-[300px] md:h-[320px] overflow-hidden">
          {/* Background blur effect */}
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            animate={{ 
              filter: isHovered ? "blur(8px)" : "blur(5px)",
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={episode.image} 
              alt={episode.title}
              className="w-full h-full object-cover brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/60"></div>
          </motion.div>
          
          {/* Episode Content */}
          <div className="relative h-full flex flex-col md:flex-row p-6">
            <motion.div 
              className="md:w-[45%] h-52 md:h-full overflow-hidden rounded-2xl shadow-xl relative group mb-4 md:mb-0 flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src={episode.image} 
                alt={episode.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
              <motion.div 
                className="absolute top-4 left-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg shadow-lg">
                  EP {episode.number}
                </Badge>
              </motion.div>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="default" 
                  className="bg-red-600/90 hover:bg-red-700 rounded-full h-16 w-16 flex items-center justify-center shadow-xl"
                  onClick={handlePlayClick}
                >
                  <Play className="h-8 w-8" fill="white" />
                </Button>
              </motion.div>
            </motion.div>
            
            <div className="md:pl-6 flex flex-col justify-between flex-grow">
              <div>
                <motion.h4 
                  className="font-bold text-xl md:text-2xl text-white tracking-tight mb-2"
                  animate={{ 
                    textShadow: isHovered ? "0 0 8px rgba(255,255,255,0.3)" : "none"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {episode.title}
                </motion.h4>
                <motion.div 
                  className="flex items-center gap-4 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="flex items-center gap-1.5 text-gray-300 bg-gray-800/60 px-3 py-1 rounded-full shadow-inner">
                    <Clock className="w-4 h-4 text-red-400" /> {episode.runtime}
                  </span>
                </motion.div>
                
                <Collapsible className="w-full overflow-hidden">
                  <CollapsibleContent className="animate-accordion-down mt-2">
                    <motion.div 
                      className="p-4 rounded-xl bg-gray-800/70 border border-gray-700/50 backdrop-blur-sm shadow-inner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className="text-gray-300 text-sm leading-relaxed">{episode.overview}</p>
                      
                      <motion.div 
                        className="mt-3 flex justify-end gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 gap-1 rounded-lg"
                        >
                          <Share className="h-3.5 w-3.5" /> Compartilhar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 gap-1 rounded-lg"
                        >
                          <Info className="h-3.5 w-3.5" /> Detalhes
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CollapsibleContent>
                  
                  <CollapsibleTrigger className="mt-2 inline-flex items-center px-3 py-1.5 bg-gray-800/60 hover:bg-gray-800/90 backdrop-blur-sm text-sm text-gray-300 hover:text-white rounded-lg border border-gray-700/50 transition-all duration-200 cursor-pointer group">
                    <span className="group-hover:text-red-400 transition-colors">Ver detalhes</span>
                    <ChevronDown className="ml-1.5 h-4 w-4 text-gray-400 group-hover:text-red-400 transition-transform duration-200 ui-open:rotate-180" />
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800/80 text-gray-300 border border-gray-700/50 px-3 py-1.5 rounded-full shadow-inner flex items-center gap-1.5"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-sm">Temporada 1</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl transform transition-all duration-300"
                    onClick={handlePlayClick}
                  >
                    <Play className="w-4 h-4 mr-1" fill="white" /> Assistir
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <MoviePlayer
        open={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        playerUrl={playerUrl}
        title={`Episódio ${episode.number}: ${episode.title}`}
      />
    </>
  );
};

export default EpisodeCard;
