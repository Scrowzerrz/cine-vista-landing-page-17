
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface SeasonInfoProps {
  season: {
    number: number;
    year: string;
    episodes: Array<{
      number: number;
      title: string;
      runtime: string;
      overview: string;
      image: string;
    }>;
  };
}

const SeasonInfo: React.FC<SeasonInfoProps> = ({ season }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8 px-4 py-5 bg-gradient-to-r from-gray-800/80 to-gray-800/40 rounded-2xl border border-gray-700/40"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl shadow-xl">
            <span className="font-bold text-xl">{season.number}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Temporada {season.number}</h3>
            <p className="text-sm text-gray-300">
              {season.year} • {season.episodes.length} episódios
            </p>
          </div>
        </div>
        <Badge className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg">
          {season.year}
        </Badge>
      </div>
    </motion.div>
  );
};

export default SeasonInfo;
