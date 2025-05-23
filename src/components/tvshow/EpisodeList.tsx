
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye } from 'lucide-react';
import EpisodeCard from './EpisodeCard';

interface EpisodeListProps {
  episodes: {
    number: number;
    title: string;
    runtime: string;
    overview: string;
    image: string;
  }[];
  selectedSeason: string;
  expandedEpisodes: Record<string, boolean>;
  toggleExpandEpisodes: (seasonNumber: string) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodes, 
  selectedSeason, 
  expandedEpisodes, 
  toggleExpandEpisodes 
}) => {
  // Display only first 2 episodes when not expanded
  const displayedEpisodes = expandedEpisodes[selectedSeason] 
    ? episodes 
    : episodes.slice(0, 2);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        key={selectedSeason}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {displayedEpisodes.map((episode) => (
          <EpisodeCard key={episode.number} episode={episode} />
        ))}
        
        {/* Show More/Less Episodes Button */}
        {episodes.length > 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center pt-2"
          >
            <Button
              onClick={() => toggleExpandEpisodes(selectedSeason)}
              variant="outline"
              className="border-gray-700/50 hover:border-red-500/70 bg-gray-800/40 hover:bg-gray-800/70 text-gray-300 hover:text-white rounded-full py-6 px-8 transition-all group"
            >
              {expandedEpisodes[selectedSeason] ? (
                <>
                  <span className="font-medium">Ver menos</span>
                  <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                </>
              ) : (
                <>
                  <span className="font-medium">Ver todos os {episodes.length} episódios</span>
                  <Eye className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EpisodeList;
