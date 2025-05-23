
import React from 'react';

const HeroSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1626972774899-5e34ecebcc0f?w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 md:px-8">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-wider">
          THE<br />
          <span className="text-red-500">LAST</span><br />
          OF US
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors">
            <span>▶</span>
            <span>ASSISTIR SÉRIE</span>
          </button>
          <button className="bg-gray-700/70 hover:bg-gray-600/70 text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors backdrop-blur-sm">
            <span>📋</span>
            <span>ADICIONAR À LISTA</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
