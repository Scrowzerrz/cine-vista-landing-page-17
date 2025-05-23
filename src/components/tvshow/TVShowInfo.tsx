
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Star, Calendar, Users, Radio, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [expandedPlot, setExpandedPlot] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'cast'>('about');
  
  // Animação para os containers principais
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  // Animação para itens individuais
  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };
  
  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tabs de navegação */}
      <motion.div 
        className="flex mb-8 border-b border-gray-700/50 overflow-hidden"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Button
          variant="ghost"
          className={cn(
            "relative px-6 py-3 rounded-none",
            activeTab === 'about' ? 
              "text-white after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500" : 
              "text-gray-400 hover:text-white"
          )}
          onClick={() => setActiveTab('about')}
        >
          <span className="text-lg font-medium">Sobre a série</span>
        </Button>
        
        <Button
          variant="ghost"
          className={cn(
            "relative px-6 py-3 rounded-none",
            activeTab === 'cast' ? 
              "text-white after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:bg-red-500" : 
              "text-gray-400 hover:text-white"
          )}
          onClick={() => setActiveTab('cast')}
        >
          <span className="text-lg font-medium">Elenco & Equipe</span>
        </Button>
      </motion.div>
      
      {/* Tab de Sobre a série */}
      {activeTab === 'about' && (
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="space-y-8"
        >
          {/* Sinopse */}
          <motion.div variants={itemAnimation} className="mb-8">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <span className="w-1 h-6 bg-red-500 mr-2"></span>
              Sinopse
            </h3>
            <div className="relative">
              <motion.p 
                className={cn(
                  "text-gray-200 text-lg leading-relaxed font-light transition-all duration-500",
                  !expandedPlot && "line-clamp-3"
                )}
                layout
              >
                {tvshow.plot}
              </motion.p>
              
              <motion.button
                onClick={() => setExpandedPlot(!expandedPlot)}
                className={cn(
                  "text-red-500 font-medium hover:text-red-400 transition-colors",
                  expandedPlot ? "mt-2 block" : "inline-block ml-1"
                )}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {expandedPlot ? 'Ver menos' : 'Ler mais...'}
              </motion.button>
              
              {!expandedPlot && (
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              )}
            </div>
          </motion.div>
          
          {/* Categorias */}
          <motion.div variants={itemAnimation} className="mb-8">
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <span className="w-1 h-6 bg-red-500 mr-2"></span>
              Categorias
            </h3>
            <motion.div 
              className="flex flex-wrap gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {tvshow.categories.map((category, index) => (
                <motion.div
                  key={category}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring" } }
                  }}
                >
                  <Badge 
                    className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-red-900 hover:to-red-800 text-white border-gray-600 px-4 py-2 text-sm font-medium shadow-lg transition-all duration-300"
                  >
                    {category}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Detalhes da Série */}
          <motion.div variants={itemAnimation}>
            <h3 className="text-xl font-bold mb-5 flex items-center">
              <span className="w-1 h-6 bg-red-500 mr-2"></span>
              Detalhes da série
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="p-3 bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-inner">
                  <Radio className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">Emissora:</h4>
                  <p className="text-white text-base font-semibold">{tvshow.network}</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start gap-4"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="p-3 bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-inner">
                  <Award className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm font-medium mb-1">Criador:</h4>
                  <p className="text-white text-base font-semibold">{tvshow.creator}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Tab de Elenco */}
      {activeTab === 'cast' && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-5 flex items-center">
              <span className="w-1 h-6 bg-red-500 mr-2"></span>
              Elenco Principal
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tvshow.cast.map((actor, index) => (
                <motion.div
                  key={actor}
                  className="flex items-center gap-4 bg-gray-800/40 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/30 hover:border-red-500/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: 0.1 * index, duration: 0.4 }
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 8px 30px rgba(255, 0, 0, 0.1)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg font-medium text-white">
                    {actor.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{actor}</h4>
                    <p className="text-gray-400 text-sm">Ator</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
          >
            <h3 className="text-xl font-bold mb-5 flex items-center">
              <span className="w-1 h-6 bg-red-500 mr-2"></span>
              Equipe de Produção
            </h3>
            
            <motion.div 
              className="flex items-start gap-4 bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/30"
              whileHover={{ 
                boxShadow: "0 8px 30px rgba(255, 0, 0, 0.1)",
                borderColor: "rgba(255, 0, 0, 0.3)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="p-3 bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-inner">
                <Award className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h4 className="text-gray-400 text-sm font-medium mb-1">Criador:</h4>
                <p className="text-white text-lg font-semibold">{tvshow.creator}</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TVShowInfo;
