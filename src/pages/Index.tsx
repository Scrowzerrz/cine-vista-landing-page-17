
import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ContentCarouselWrapper from '../components/ContentCarouselWrapper';
import Footer from '../components/Footer';

const Index = () => {
  const moviesData = [
    {
      id: 1,
      title: "Missão: Impossível - O Acerto Final Parte Um",
      year: "2023",
      duration: "163min",
      image: "https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYUkEgdZe.jpg",
      quality: "FULLHD",
      type: "DUB",
      contentType: "movie"
    },
    {
      id: 2,
      title: "Elementos",
      year: "2023",
      duration: "102min",
      image: "https://image.tmdb.org/t/p/w500/6oH378gE7vSoRvHwKqfS_OjkSj2.jpg",
      quality: "HD",
      type: "LEG",
      contentType: "movie"
    },
    {
      id: 3,
      title: "Velozes & Furiosos 10",
      year: "2023",
      duration: "141min",
      image: "https://image.tmdb.org/t/p/w500/wXNihLltMCGR7Xep3fSo7Y0VvDk.jpg",
      quality: "FULLHD",
      type: "DUB",
      contentType: "movie"
    },
    {
      id: 4,
      title: "Guardiões da Galáxia: Volume 3",
      year: "2023",
      duration: "150min",
      image: "https://image.tmdb.org/t/p/w500/mgFdvrwlzM6xRaPAFYiVj3G7ou4.jpg",
      quality: "4K",
      type: "DUB",
      contentType: "movie"
    },
    {
      id: 5,
      title: "Homem-Aranha: Através do Aranhaverso",
      year: "2023",
      duration: "140min",
      image: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      quality: "FULLHD",
      type: "LEG",
      contentType: "movie"
    },
     {
      id: 6,
      title: "Oppenheimer",
      year: "2023",
      duration: "180min",
      image: "https://image.tmdb.org/t/p/w500/c0DCmfLh6Lh3SRs372GN7b0EHaC.jpg",
      quality: "4K",
      type: "DUB",
      contentType: "movie"
    },
    {
      id: 7,
      title: "Barbie",
      year: "2023",
      duration: "114min",
      image: "https://image.tmdb.org/t/p/w500/yRRuLt7sMB0xOSjBlwPNOo50G56.jpg",
      quality: "FULLHD",
      type: "LEG",
      contentType: "movie"
    },
  ];

  const seriesData = [
    {
      id: 1,
      title: "The Last of Us",
      year: "2023",
      duration: "S1 E9",
      image: "https://image.tmdb.org/t/p/w500/uKvVjHNqB5VmOrdxqAt2F7tKqQR.jpg",
      quality: "4K",
      type: "DUB",
      contentType: "tvshow"
    },
    {
      id: 2,
      title: "Wandinha",
      year: "2022",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/ooBR3q49rorFe72OiAyH3W9Xhcb.jpg",
      quality: "FULLHD",
      type: "DUB",
      contentType: "tvshow"
    },
    {
      id: 3,
      title: "The Mandalorian",
      year: "2023",
      duration: "S3 E8",
      image: "https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg",
      quality: "4K",
      type: "LEG",
      contentType: "tvshow"
    },
    {
      id: 4,
      title: "Succession",
      year: "2023",
      duration: "S4 E10",
      image: "https://image.tmdb.org/t/p/w500/x5tY3UEKSeS7K2EML0zJcR0aN2r.jpg",
      quality: "FULLHD",
      type: "LEG",
      contentType: "tvshow"
    },
    {
      id: 5,
      title: "Loki",
      year: "2023",
      duration: "S2 E6",
      image: "https://image.tmdb.org/t/p/w500/voHU2TwK2x355TzT5v3QvfC54g.jpg",
      quality: "4K",
      type: "DUB",
      contentType: "tvshow"
    },
    {
      id: 6,
      title: "Ahsoka",
      year: "2023",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/laN1B5S4FX8b99Vd6n272YOvzo9.jpg",
      quality: "FULLHD",
      type: "DUB",
      contentType: "tvshow"
    },
    {
      id: 7,
      title: "Gen V",
      year: "2023",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/sH32Tf9UBxM2Q0adq2jP0nPU27q.jpg",
      quality: "4K",
      type: "LEG",
      contentType: "tvshow"
    }
  ];

  return (
    <div className="min-h-screen bg-black/95 text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        
        <div className="container mx-auto px-4 py-12 space-y-12 max-w-7xl"> 
          <ContentCarouselWrapper 
            title="Filmes" 
            data={moviesData}
            categories={["LANÇAMENTOS", "MAIS VISTOS", "EM ALTA", "RECOMENDADOS"]}
            contentType="movie"
          />
          
          <ContentCarouselWrapper 
            title="Séries" 
            data={seriesData}
            categories={["NOVOS EPISÓDIOS", "MAIS VISTAS", "EM ALTA", "RECOMENDADAS"]}
            contentType="tvshow"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
