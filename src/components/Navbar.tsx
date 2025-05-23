
import React, { useState } from 'react';
import { Search, PlayIcon, MenuIcon, XIcon, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

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
    <nav className="bg-gray-900/90 backdrop-blur-md fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo and Desktop Navigation Links */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <PlayIcon className="h-7 w-7 text-red-500 mr-1.5" />
                <span className="text-2xl md:text-3xl font-bold text-white">
                  POBRE<span className="text-red-500">FLIX</span>
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:items-baseline md:space-x-6 lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    link.current
                      ? 'text-white hover:text-red-400'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  } ${link.dropdown ? 'flex items-center' : ''}`}
                  aria-current={link.current ? 'page' : undefined}
                >
                  {link.label}
                  {link.dropdown && <span className="ml-1 text-xs">▼</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Search, Register Button (Desktop) and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center bg-gray-800/70 rounded-lg px-3 py-1.5 mr-4 border border-gray-700 focus-within:border-red-500 transition-colors">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-32 lg:w-48 transition-all duration-300 focus:w-40 lg:focus:w-56"
              />
            </div>
            
            {/* User Auth Section */}
            <div className="hidden md:block">
              {!loading && (
                user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-9 w-9">
                          {profile?.avatar_url ? (
                            <AvatarImage src={profile.avatar_url} alt={profile.username || "Avatar do usuário"} />
                          ) : (
                            <AvatarFallback className="bg-red-600 text-white">{getInitials()}</AvatarFallback>
                          )}
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    variant="default" 
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-4 py-2"
                    onClick={() => navigate('/auth')}
                  >
                    Entrar
                  </Button>
                )
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.label}`}
                to={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ${
                  link.current
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/80'
                } ${link.dropdown ? 'flex items-center justify-between' : ''}`}
                aria-current={link.current ? 'page' : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
                {link.dropdown && <span className="ml-1 text-xs">▼</span>}
              </Link>
            ))}
             <div className="pt-2 pb-1 px-3">
                <div className="flex items-center bg-gray-800/70 rounded-lg px-3 py-2 border border-gray-700 focus-within:border-red-500 transition-colors w-full">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
                />
                </div>
            </div>
            <div className="pt-2 pb-1 px-3">
              {!loading && (
                user ? (
                  <>
                    <div className="flex items-center px-3 py-2 text-gray-200 mb-2">
                      <Avatar className="h-8 w-8 mr-2">
                        {profile?.avatar_url ? (
                          <AvatarImage src={profile.avatar_url} alt={profile.username || "Avatar do usuário"} />
                        ) : (
                          <AvatarFallback className="bg-red-600 text-white">{getInitials()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile?.username || user.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-200 hover:bg-gray-700"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm"
                    onClick={() => {
                      navigate('/auth');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Entrar
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
