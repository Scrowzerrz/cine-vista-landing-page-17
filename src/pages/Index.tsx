
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ContentCarousel from '../components/ContentCarousel';
import Footer from '../components/Footer';

const Index = () => {
  const moviesData = [
    {
      id: 1,
      title: "Missão: Impossível - O Acerto Final",
      year: "2025",
      duration: "148min",
      image: "https://images.unsplash.com/photo-1489599136344-8e46e56c0ee2?w=300&h=400&fit=crop",
      quality: "LEG",
      type: "CAM"
    },
    {
      id: 2,
      title: "Promoção 6: Laços de Sangue",
      year: "2025",
      duration: "110min",
      image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=400&fit=crop",
      quality: "DUB",
      type: "CAM"
    },
    {
      id: 3,
      title: "Resgate Implacável",
      year: "2025",
      duration: "118min",
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=400&fit=crop",
      quality: "DUB",
      type: "HD"
    },
    {
      id: 4,
      title: "Um Filme Minecraft",
      year: "2025",
      duration: "101min",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=400&fit=crop",
      quality: "DUB",
      type: "HD"
    },
    {
      id: 5,
      title: "Karatê Kid: Lendas",
      year: "2025",
      duration: "90min",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=400&fit=crop",
      quality: "DUB",
      type: "CAM"
    }
  ];

  const seriesData = [
    {
      id: 1,
      title: "Pablo e Luisão",
      year: "2025",
      duration: "95min",
      image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300&h=400&fit=crop",
      quality: "DUB",
      type: "HD"
    },
    {
      id: 2,
      title: "Georgie e Mandy - Seu Primeiro Casamento",
      year: "2024",
      duration: "18min",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&h=400&fit=crop",
      quality: "DUB",
      type: "HD"
    },
    {
      id: 3,
      title: "Muito Esforçado",
      year: "2025",
      duration: "37min",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      quality: "LEG",
      type: "HD"
    },
    {
      id: 4,
      title: "Motorheads: Velozes e Apaixonados",
      year: "2025",
      duration: "48min",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop",
      quality: "LEG",
      type: "HD"
    },
    {
      id: 5,
      title: "O Jogo do Diabo",
      year: "2023",
      duration: "101min",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      quality: "DUB",
      type: "HD"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <HeroSection />
      <div className="px-4 md:px-8 lg:px-16 pb-16">
        <ContentCarousel 
          title="Filmes" 
          data={moviesData}
          categories={["LANÇAMENTOS", "RECENTES", "MAIS VISTOS", "EM ALTA"]}
        />
        <ContentCarousel 
          title="Séries" 
          data={seriesData}
          categories={["NOVOS EPISÓDIOS", "RECENTES", "MAIS VISTOS", "EM ALTA"]}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
