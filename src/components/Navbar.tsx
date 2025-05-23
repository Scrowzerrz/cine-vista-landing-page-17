
import React, { useState } from 'react';
import { Search } from 'lucide-react';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 px-4 md:px-8 lg:px-16 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-red-500">
            POBREFLIX 
            <span className="text-white ml-2">▶</span>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-red-400 transition-colors">Início</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
              Filmes <span className="ml-1">▼</span>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
              Séries <span className="ml-1">▼</span>
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Pedidos</a>
          </div>
        </div>

        {/* Search and Register */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-gray-800 rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 outline-none w-48"
            />
            <Search className="w-5 h-5 text-gray-400 ml-2" />
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Registrar
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
