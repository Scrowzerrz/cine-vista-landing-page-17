
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { User, Users, Tv, Tag } from 'lucide-react';

interface TVShowInfoProps {
  tvshow: {
    plot: string;
    categories: string[];
    creator: string;
    cast: string[];
    network: string;
  };
}

const TVShowInfo: React.FC<TVShowInfoProps> = ({ tvshow }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="backdrop-blur-sm bg-gray-800/40 rounded-3xl border border-gray-700/50 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Plot Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-full mr-3"></div>
          <h3 className="text-xl font-bold text-white">SINOPSE</h3>
        </div>
        <div className="relative">
          <p className="text-gray-300 text-lg leading-relaxed tracking-wide">
            {tvshow.plot}
          </p>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-red-400 hover:text-red-300 hover:underline ml-2 cursor-pointer font-medium transition-colors duration-200"
          >
            Ler mais...
          </motion.span>
        </div>
      </motion.div>
      
      {/* Categories Section */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center mb-4">
          <Tag className="w-5 h-5 text-red-500 mr-2" />
          <h4 className="text-lg font-semibold text-white">GÊNEROS</h4>
        </div>
        <div className="flex flex-wrap gap-3">
          {tvshow.categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-red-600 hover:to-red-700 text-white border border-gray-600/50 hover:border-red-500/50 px-4 py-2 rounded-full shadow-lg hover:shadow-red-500/20 transition-all duration-300 cursor-pointer">
                {category}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* TV Show Details Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Creator */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-red-400 text-sm font-semibold uppercase tracking-wider">Criador</h4>
          </div>
          <p className="text-white font-medium text-lg">{tvshow.creator}</p>
        </motion.div>

        {/* Network */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <Tv className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Emissora</h4>
          </div>
          <p className="text-white font-medium text-lg">{tvshow.network}</p>
        </motion.div>

        {/* Cast */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-red-500/30 transition-all duration-300 shadow-lg hover:shadow-xl md:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Elenco Principal</h4>
          </div>
          <p className="text-white font-medium text-lg leading-relaxed">{tvshow.cast.join(", ")}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TVShowInfo;
