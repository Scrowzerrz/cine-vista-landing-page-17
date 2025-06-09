import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-red-500' : 'hover:text-gray-300';
  };

  return (
    <nav className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          LOV
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-300 focus:outline-none"
          aria-label="Open Menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className={isActive('/')}>
            Filmes
          </Link>
          <Link to="/tvshows" className={isActive('/tvshows')}>
            Séries
          </Link>
          {user ? (
            <>
              <Link to="/profile" className={isActive('/profile')}>
                Perfil
              </Link>
              {user.email === 'admin@email.com' && (
                <Link to="/admin" className={isActive('/admin')}>
                  Admin
                </Link>
              )}
              <button onClick={logout} className="hover:text-gray-300 focus:outline-none">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className={isActive('/auth/login')}>
                Login
              </Link>
              <Link to="/auth/register" className={isActive('/auth/register')}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="bg-gray-800 text-white absolute top-0 right-0 h-full w-64 p-4">
              <div className="flex justify-end mb-4">
                <button onClick={closeMenu} className="text-gray-300 focus:outline-none">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                <Link to="/" className={isActive('/')} onClick={closeMenu}>
                  Filmes
                </Link>
                <Link to="/tvshows" className={isActive('/tvshows')} onClick={closeMenu}>
                  Séries
                </Link>
                {user ? (
                  <>
                    <Link to="/profile" className={isActive('/profile')} onClick={closeMenu}>
                      Perfil
                    </Link>
                    {user.email === 'admin@email.com' && (
                      <Link to="/admin" className={isActive('/admin')} onClick={closeMenu}>
                        Admin
                      </Link>
                    )}
                    <button onClick={logout} className="hover:text-gray-300 focus:outline-none">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/login" className={isActive('/auth/login')} onClick={closeMenu}>
                      Login
                    </Link>
                    <Link to="/auth/register" className={isActive('/auth/register')} onClick={closeMenu}>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
