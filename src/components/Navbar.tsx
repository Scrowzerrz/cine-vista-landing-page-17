
import React, { useState, useEffect } from 'react';
import { Search, PlayIcon, MenuIcon, XIcon, LogOut, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Início", current: true },
    { href: "#", label: "Filmes", dropdown: true },
    { href: "#", label: "Séries", dropdown: true },
    { href: "#", label: "Pedidos" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso",
        description: "Você saiu da sua conta."
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível realizar o logout.",
        variant: "destructive"
      });
    }
  };

  const getInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl' 
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link to="/" className="flex items-center group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <PlayIcon className="h-8 w-8 text-red-500 mr-2 drop-shadow-lg" />
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg group-hover:bg-red-500/40 transition-colors"></div>
                </motion.div>
                <span className="text-2xl md:text-3xl font-bold">
                  <span className="text-white drop-shadow-lg">POBRE</span>
                  <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">FLIX</span>
                </span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    to={link.href}
                    className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      link.current
                        ? 'text-white bg-white/10 backdrop-blur-sm border border-white/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                    }`}
                  >
                    <span className="relative z-10 flex items-center">
                      {link.label}
                      {link.dropdown && (
                        <motion.span 
                          animate={{ rotate: 0 }}
                          whileHover={{ rotate: 180 }}
                          className="ml-1 text-xs transition-transform duration-300"
                        >
                          ▼
                        </motion.span>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-700/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      layoutId={link.current ? "activeTab" : undefined}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search and User Section */}
          <div className="flex items-center gap-4">
            {/* Enhanced Search */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden md:flex items-center"
            >
              <div className={`flex items-center bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border transition-all duration-300 ${
                searchFocused 
                  ? 'border-red-500/60 bg-black/60 shadow-lg shadow-red-500/20' 
                  : 'border-gray-700/50 hover:border-gray-600/70'
              }`}>
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Pesquisar filmes, séries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-48 lg:w-64"
                />
              </div>
            </motion.div>
            
            {/* Notifications */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-white/10 rounded-full">
                  <Bell className="h-5 w-5" />
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                </Button>
              </motion.div>
            )}
            
            {/* User Auth Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="hidden md:block"
            >
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-red-500/50 transition-all">
                        <Avatar className="h-9 w-9 border-2 border-white/20">
                          {profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt={profile.username || "Avatar do usuário"} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white font-semibold">{getInitials()}</AvatarFallback>
                          )}
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-black/95 backdrop-blur-xl border border-gray-800" align="end">
                      <DropdownMenuLabel className="text-gray-200">Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm px-6 py-2 rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                      onClick={() => navigate('/auth')}
                    >
                      Entrar
                    </Button>
                  </motion.div>
                )
              )}
            </motion.div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
              >
                <AnimatePresence>
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <XIcon className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MenuIcon className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link, index) => (
                <motion.div
                  key={`mobile-${link.label}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                      link.current
                        ? 'bg-gradient-to-r from-red-600/20 to-red-700/20 text-white border border-red-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center justify-between">
                      {link.label}
                      {link.dropdown && <span className="text-xs">▼</span>}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4"
              >
                <div className="flex items-center bg-black/60 backdrop-blur-md rounded-xl px-4 py-3 border border-gray-700/50">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
                  />
                </div>
              </motion.div>

              {/* Mobile User Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-gray-800"
              >
                {!loading && (
                  user ? (
                    <div className="space-y-3">
                      <div className="flex items-center px-4 py-3 bg-white/5 rounded-xl">
                        <Avatar className="h-10 w-10 mr-3 border-2 border-white/20">
                          {profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt={profile.username || "Avatar do usuário"} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white">{getInitials()}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{profile?.username || user.email}</p>
                          <p className="text-sm text-gray-400">Minha conta</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-700 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white rounded-xl"
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-sm rounded-xl"
                      onClick={() => {
                        navigate('/auth');
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Entrar
                    </Button>
                  )
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
