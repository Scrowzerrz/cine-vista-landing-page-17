import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm text-white fixed top-0 left-0 w-full z-50 border-b border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          StreamSphere
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={location.pathname === '/' ? 'text-red-500' : 'hover:text-gray-300'}>
            Início
          </Link>
          <Link to="/movies" className={location.pathname === '/movies' ? 'text-red-500' : 'hover:text-gray-300'}>
            Filmes
          </Link>
          <Link to="/tvshows" className={location.pathname === '/tvshows' ? 'text-red-500' : 'hover:text-gray-300'}>
            Séries
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>{user.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth" className="hover:text-gray-300">
                Entrar
              </Link>
              <Link to="/register" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                Cadastrar
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800"
            >
              <div className="px-4 py-6 flex flex-col space-y-4">
                <Link to="/" onClick={closeMenu} className="block hover:text-gray-300">
                  Início
                </Link>
                <Link to="/movies" onClick={closeMenu} className="block hover:text-gray-300">
                  Filmes
                </Link>
                <Link to="/tvshows" onClick={closeMenu} className="block hover:text-gray-300">
                  Séries
                </Link>
                {user ? (
                  <>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span>{user.email}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full gap-2">
                      <LogOut className="w-4 h-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={closeMenu} className="block hover:text-gray-300">
                      Entrar
                    </Link>
                    <Link to="/register" onClick={closeMenu} className="block bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </nav>
  );
};

export default Navbar;
