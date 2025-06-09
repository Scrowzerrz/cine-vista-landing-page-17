import React, { useState, useEffect } from 'react';
import { Search, PlayIcon, MenuIcon, XIcon, LogOut, User, Bell, Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
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
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        isScrolled 
          ? 'bg-black/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/50' 
          : 'bg-gradient-to-b from-black/90 via-black/70 to-transparent backdrop-blur-md'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link to="/" className="flex items-center group">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative mr-3"
                >
                  <PlayIcon className="h-9 w-9 text-red-500 drop-shadow-2xl" />
                  <motion.div 
                    className="absolute inset-0 bg-red-500/30 rounded-full blur-xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-black tracking-tight">
                    <span className="text-white drop-shadow-lg">POBRE</span>
                    <span className="bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-clip-text text-transparent">FLIX</span>
                  </span>
                  <motion.div 
                    className="h-0.5 bg-gradient-to-r from-red-500 to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-12 md:flex md:items-center md:space-x-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.6, ease: "easeOut" }}
                >
                  <Link
                    to={link.href}
                    className={`group relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      link.current
                        ? 'text-white bg-gradient-to-r from-red-600/20 to-red-500/10 border border-red-500/30 shadow-lg shadow-red-500/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="relative z-10 flex items-center">
                      {link.label}
                      {link.dropdown && (
                        <motion.span 
                          animate={{ rotate: 0 }}
                          whileHover={{ rotate: 180 }}
                          transition={{ duration: 0.3 }}
                          className="ml-2 text-xs"
                        >
                          ▼
                        </motion.span>
                      )}
                    </span>
                    {!link.current && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.02 }}
                      />
                    )}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      layoutId={link.current ? "activeNavTab" : undefined}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search and User Section */}
          <div className="flex items-center gap-3">
            {/* Enhanced Search */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="hidden md:flex items-center"
            >
              <motion.div 
                className={`flex items-center bg-black/50 backdrop-blur-xl rounded-2xl px-4 py-2.5 border transition-all duration-500 ${
                  searchFocused 
                    ? 'border-red-500/50 bg-black/70 shadow-xl shadow-red-500/20 scale-105' 
                    : 'border-white/10 hover:border-white/20 hover:bg-black/60'
                }`}
                whileFocus={{ scale: 1.02 }}
              >
                <Search className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                  searchFocused ? 'text-red-400' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Pesquisar filmes, séries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-white text-sm placeholder-gray-400 outline-none w-48 lg:w-72 font-medium"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
            
            {/* Notifications */}
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 border border-transparent hover:border-white/20"
                  >
                    <Bell className="h-5 w-5" />
                    <motion.div 
                      className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            {/* User Auth Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="hidden md:block"
            >
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="ghost" 
                          className="relative h-11 w-11 rounded-full hover:ring-2 hover:ring-red-500/40 transition-all duration-300 border border-white/10 hover:border-red-500/30"
                        >
                          <Avatar className="h-10 w-10 border-2 border-white/20">
                            {profile?.avatar_url ? (
                              <AvatarImage src={profile.avatar_url} alt={profile.username || "Avatar do usuário"} />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white font-bold text-sm shadow-xl">
                                {getInitials()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-64 bg-black/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-2" 
                      align="end"
                      sideOffset={8}
                    >
                      <DropdownMenuLabel className="text-gray-200 font-semibold px-3 py-2">
                        Minha Conta
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/10 my-2" />
                      <DropdownMenuItem className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2.5 transition-all duration-200">
                        <User className="mr-3 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      {isAdmin() && (
                        <DropdownMenuItem 
                          className="cursor-pointer text-gray-300 hover:text-white hover:bg-white/10 rounded-xl px-3 py-2.5 transition-all duration-200" 
                          onClick={() => navigate('/upanel')}
                        >
                          <Upload className="mr-3 h-4 w-4" />
                          <span>Painel de Uploads</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-white/10 my-2" />
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl px-3 py-2.5 transition-all duration-200" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="default" 
                      className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 hover:from-red-500 hover:via-red-400 hover:to-red-500 text-white font-bold text-sm px-8 py-2.5 rounded-2xl shadow-xl shadow-red-500/30 hover:shadow-red-500/40 transition-all duration-300 border border-red-400/30"
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
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <AnimatePresence mode="wait">
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden border-t border-white/10 bg-black/98 backdrop-blur-2xl"
          >
            <div className="px-4 pt-6 pb-8 space-y-6">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={`mobile-${link.label}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                  >
                    <Link
                      to={link.href}
                      className={`block px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 ${
                        link.current
                          ? 'bg-gradient-to-r from-red-600/20 to-red-500/10 text-white border border-red-500/30 shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex items-center justify-between">
                        {link.label}
                        {link.dropdown && <span className="text-xs opacity-70">▼</span>}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-4 border-t border-white/10"
              >
                <div className="flex items-center bg-black/60 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10">
                  <Search className="w-5 h-5 text-gray-400 mr-4" />
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-white text-base placeholder-gray-400 outline-none w-full font-medium"
                  />
                </div>
              </motion.div>

              {/* Mobile User Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="pt-4 border-t border-white/10"
              >
                {!loading && (
                  user ? (
                    <div className="space-y-4">
                      <div className="flex items-center px-6 py-4 bg-white/5 rounded-2xl border border-white/10">
                        <Avatar className="h-12 w-12 mr-4 border-2 border-white/20">
                          {profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt={profile.username || "Avatar do usuário"} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white font-bold">
                              {getInitials()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white text-lg">{profile?.username || user.email}</p>
                          <p className="text-sm text-gray-400">Minha conta</p>
                        </div>
                      </div>
                      {isAdmin() && (
                        <Button 
                          variant="outline" 
                          className="w-full border-white/20 bg-white/5 text-gray-200 hover:bg-white/10 hover:text-white hover:border-white/30 rounded-2xl py-3 font-semibold transition-all duration-300"
                          onClick={() => {
                            navigate('/upanel');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <Upload className="mr-3 h-5 w-5" />
                          Painel de Uploads
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/50 rounded-2xl py-3 font-semibold transition-all duration-300"
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base rounded-2xl py-4 shadow-xl shadow-red-500/30 transition-all duration-300"
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
