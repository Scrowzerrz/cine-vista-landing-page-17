
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Calendar } from 'lucide-react';

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
      transition={{ duration: 0.4 }}
      className="mb-8 overflow-hidden"
    >
      {/* Animated card background */}
      <motion.div 
        className="relative px-6 py-5 rounded-2xl overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient background with animation */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-gray-800/95 via-gray-800/80 to-gray-800/70 border border-gray-700/40 rounded-2xl shadow-lg"
          animate={{ 
            backgroundColor: ['rgba(31,41,55,0.9)', 'rgba(31,41,55,0.8)', 'rgba(31,41,55,0.9)'],
            boxShadow: [
              '0 4px 30px rgba(0, 0, 0, 0.1)',
              '0 4px 30px rgba(239, 68, 68, 0.1)',
              '0 4px 30px rgba(0, 0, 0, 0.1)'
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div 
              className="h-16 w-16 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 text-white rounded-2xl shadow-xl"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(239, 68, 68, 0.5)" 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.span 
                className="font-bold text-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {season.number}
              </motion.span>
            </motion.div>
            
            <div>
              <motion.h3 
                className="text-xl font-bold text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                Temporada {season.number}
              </motion.h3>
              
              <motion.div 
                className="flex items-center gap-3 mt-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <Calendar className="h-3.5 w-3.5 text-blue-400" />
                  <span>{season.year}</span>
                </div>
                
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                  <span>{season.episodes.length} episódios</span>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            className="flex gap-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Badge className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {season.year}
            </Badge>
            
            <Badge className="bg-gray-700/90 hover:bg-gray-700 text-gray-100 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-yellow-400" />
              Temporada {season.number}
            </Badge>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SeasonInfo;
