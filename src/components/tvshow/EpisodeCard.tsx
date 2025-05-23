
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, ChevronDown, Share, CalendarIcon, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import MoviePlayer from '@/components/movie/MoviePlayer';
import { Card, CardContent } from '@/components/ui/card';

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
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);
  
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
        className="overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-700/30 transition-all duration-500 hover:border-red-500/50 shadow-lg hover:shadow-red-900/10 hover:shadow-xl group"
      >
        <Card className="border-0 bg-transparent">
          <CardContent className="p-0">
            <div className="relative w-full md:h-[300px] overflow-hidden">
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
              <div className="relative h-full flex flex-col md:flex-row p-4 sm:p-6">
                <motion.div 
                  className="w-full md:w-[45%] h-40 sm:h-52 md:h-full overflow-hidden rounded-xl sm:rounded-2xl shadow-xl relative group mb-4 md:mb-0 flex-shrink-0"
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
                    className="absolute top-3 sm:top-4 left-3 sm:left-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className="bg-red-600/90 hover:bg-red-600 text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-lg text-xs sm:text-sm">
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
                      className="bg-red-600/90 hover:bg-red-700 rounded-full h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center shadow-xl"
                      onClick={handlePlayClick}
                    >
                      <Play className="h-6 w-6 sm:h-8 sm:w-8" fill="white" />
                    </Button>
                  </motion.div>
                </motion.div>
                
                <div className="md:pl-6 flex flex-col justify-between flex-grow">
                  <div>
                    <motion.h4 
                      className="font-bold text-lg sm:text-xl md:text-2xl text-white tracking-tight mb-2"
                      animate={{ 
                        textShadow: isHovered ? "0 0 8px rgba(255,255,255,0.3)" : "none"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {episode.title}
                    </motion.h4>
                    <motion.div 
                      className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="flex items-center gap-1 sm:gap-1.5 text-gray-300 bg-gray-800/60 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-inner text-xs sm:text-sm">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" /> {episode.runtime}
                      </span>
                    </motion.div>
                    
                    <Collapsible 
                      className="w-full overflow-hidden"
                      open={isCollapsibleOpen}
                      onOpenChange={setIsCollapsibleOpen}
                    >
                      <CollapsibleContent className="animate-accordion-down mt-2">
                        <motion.div 
                          className="p-3 sm:p-4 rounded-xl bg-gray-800/70 border border-gray-700/50 backdrop-blur-sm shadow-inner"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{episode.overview}</p>
                          
                          <motion.div 
                            className="mt-3 flex justify-end gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 gap-1 rounded-lg text-xs"
                            >
                              <Share className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Compartilhar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-transparent border-gray-700 hover:bg-gray-800 text-gray-300 gap-1 rounded-lg text-xs"
                            >
                              <Info className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Detalhes
                            </Button>
                          </motion.div>
                        </motion.div>
                      </CollapsibleContent>
                      
                      <CollapsibleTrigger className="mt-2 inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800/60 hover:bg-gray-800/90 backdrop-blur-sm text-xs sm:text-sm text-gray-300 hover:text-white rounded-lg border border-gray-700/50 transition-all duration-200 cursor-pointer group">
                        <span className="group-hover:text-red-400 transition-colors">Ver detalhes</span>
                        <ChevronDown className={`ml-1.5 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-red-400 transition-transform duration-200 ${isCollapsibleOpen ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-800/80 text-gray-300 border border-gray-700/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-inner flex items-center gap-1 sm:gap-1.5"
                    >
                      <CalendarIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-400" />
                      <span className="text-xs sm:text-sm">Temporada 1</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl transform transition-all duration-300 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={handlePlayClick}
                      >
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="white" /> Assistir
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
