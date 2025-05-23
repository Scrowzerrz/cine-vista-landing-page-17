
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sword, 
  Heart, 
  Zap, 
  Ghost, 
  Laugh, 
  Rocket, 
  Crown, 
  Car,
  Skull,
  Music,
  Baby,
  Users
} from 'lucide-react';

const MovieCategories = () => {
  const categories = [
    {
      id: 1,
      name: 'Ação',
      icon: Sword,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/20 to-red-600/20',
      count: '2.5K+',
      description: 'Adrenalina pura'
    },
    {
      id: 2,
      name: 'Romance',
      icon: Heart,
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-500/20 to-rose-600/20',
      count: '1.8K+',
      description: 'Histórias de amor'
    },
    {
      id: 3,
      name: 'Ficção Científica',
      icon: Rocket,
      gradient: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-500/20 to-purple-600/20',
      count: '1.2K+',
      description: 'Futuro e tecnologia'
    },
    {
      id: 4,
      name: 'Terror',
      icon: Ghost,
      gradient: 'from-gray-600 to-black',
      bgGradient: 'from-gray-600/20 to-black/40',
      count: '950+',
      description: 'Sustos garantidos'
    },
    {
      id: 5,
      name: 'Comédia',
      icon: Laugh,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
      count: '2.1K+',
      description: 'Diversão garantida'
    },
    {
      id: 6,
      name: 'Aventura',
      icon: Zap,
      gradient: 'from-green-500 to-teal-600',
      bgGradient: 'from-green-500/20 to-teal-600/20',
      count: '1.6K+',
      description: 'Jornadas épicas'
    },
    {
      id: 7,
      name: 'Drama',
      icon: Crown,
      gradient: 'from-purple-500 to-indigo-600',
      bgGradient: 'from-purple-500/20 to-indigo-600/20',
      count: '1.9K+',
      description: 'Emoções profundas'
    },
    {
      id: 8,
      name: 'Animação',
      icon: Baby,
      gradient: 'from-cyan-500 to-blue-500',
      bgGradient: 'from-cyan-500/20 to-blue-500/20',
      count: '850+',
      description: 'Para toda família'
    },
    {
      id: 9,
      name: 'Thriller',
      icon: Skull,
      gradient: 'from-red-700 to-black',
      bgGradient: 'from-red-700/20 to-black/40',
      count: '1.1K+',
      description: 'Tensão máxima'
    },
    {
      id: 10,
      name: 'Musical',
      icon: Music,
      gradient: 'from-pink-400 to-purple-500',
      bgGradient: 'from-pink-400/20 to-purple-500/20',
      count: '420+',
      description: 'Ritmo e melodia'
    },
    {
      id: 11,
      name: 'Corrida',
      icon: Car,
      gradient: 'from-red-500 to-yellow-500',
      bgGradient: 'from-red-500/20 to-yellow-500/20',
      count: '310+',
      description: 'Velocidade pura'
    },
    {
      id: 12,
      name: 'Biografia',
      icon: Users,
      gradient: 'from-gray-500 to-slate-600',
      bgGradient: 'from-gray-500/20 to-slate-600/20',
      count: '580+',
      description: 'Vidas reais'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative"
    >
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
          Explore por Categoria
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Descubra filmes e séries organizados pelos gêneros que você mais ama
        </p>
      </motion.div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.bgGradient} backdrop-blur-sm border border-gray-800/50 hover:border-gray-700/70 transition-all duration-300 p-6 h-full`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-xl transform translate-x-10 -translate-y-10"></div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className={`p-4 rounded-xl bg-gradient-to-br ${category.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Category Info */}
                  <div>
                    <h3 className="font-bold text-white group-hover:text-gray-200 transition-colors text-sm md:text-base">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 hidden md:block">
                      {category.description}
                    </p>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.05 + 0.3 }}
                      className={`inline-block px-2 py-1 rounded-full bg-gradient-to-r ${category.gradient} text-white text-xs font-semibold mt-2`}
                    >
                      {category.count}
                    </motion.div>
                  </div>
                </div>

                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.gradient} p-[1px]`}>
                    <div className="w-full h-full rounded-2xl bg-black/90"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-10 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-10 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </motion.div>
  );
};

export default MovieCategories;
