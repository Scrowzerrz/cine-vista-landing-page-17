
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  return (
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
      className="overflow-hidden rounded-3xl border border-gray-700/30 transition-all duration-300 hover:border-red-500/50 shadow-lg hover:shadow-red-900/10 hover:shadow-xl group"
    >
      <div className="relative w-full h-[300px] md:h-[320px] overflow-hidden">
        {/* Episode Image with Blurred Background */}
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={episode.image} 
            alt={episode.title}
            className="w-full h-full object-cover blur-md scale-110 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-gray-900/60"></div>
        </div>
        
        {/* Episode Content */}
        <div className="relative h-full flex flex-col md:flex-row p-6">
          <div className="md:w-[45%] h-52 md:h-full overflow-hidden rounded-2xl shadow-xl relative group mb-4 md:mb-0 flex-shrink-0">
            <img 
              src={episode.image} 
              alt={episode.title}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg shadow-lg">
                EP {episode.number}
              </Badge>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button variant="default" className="bg-red-600/90 hover:bg-red-700 rounded-full h-16 w-16 flex items-center justify-center shadow-xl">
                <Play className="h-8 w-8" fill="white" />
              </Button>
            </div>
          </div>
          
          <div className="md:pl-6 flex flex-col justify-between flex-grow">
            <div>
              <h4 className="font-bold text-xl md:text-2xl text-white tracking-tight mb-2">{episode.title}</h4>
              <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Clock className="w-4 h-4 text-red-400" /> {episode.runtime}
                </span>
              </div>
              
              <Collapsible className="w-full">
                <CollapsibleContent className="animate-accordion-down mt-2">
                  <div className="p-4 rounded-xl bg-gray-800/70 border border-gray-700/50 backdrop-blur-sm shadow-inner">
                    <p className="text-gray-300 text-sm leading-relaxed">{episode.overview}</p>
                  </div>
                </CollapsibleContent>
                
                <CollapsibleTrigger className="mt-2 inline-flex items-center px-3 py-1.5 bg-gray-800/60 hover:bg-gray-800/90 backdrop-blur-sm text-sm text-gray-300 hover:text-white rounded-lg border border-gray-700/50 transition-all duration-200 cursor-pointer group">
                  <span className="group-hover:text-red-400 transition-colors">Ver detalhes</span>
                  <ChevronDown className="ml-1.5 h-4 w-4 text-gray-400 group-hover:text-red-400 transition-transform duration-200 ui-open:rotate-180" />
                </CollapsibleTrigger>
              </Collapsible>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <Badge className="bg-gray-800/80 text-gray-300 border border-gray-700/50 px-2 py-1 rounded-md">
                {episode.runtime}
              </Badge>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-xl transform transition-all duration-300 hover:translate-y-[-2px]">
                <Play className="w-4 h-4 mr-1" fill="white" /> Assistir
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EpisodeCard;
