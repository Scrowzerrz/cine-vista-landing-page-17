
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
      type: "DUB"
    },
    {
      id: 2,
      title: "Elementos",
      year: "2023",
      duration: "102min",
      image: "https://image.tmdb.org/t/p/w500/6oH378gE7vSoRvHwKqfS_OjkSj2.jpg",
      quality: "HD",
      type: "LEG"
    },
    {
      id: 3,
      title: "Velozes & Furiosos 10",
      year: "2023",
      duration: "141min",
      image: "https://image.tmdb.org/t/p/w500/wXNihLltMCGR7Xep3fSo7Y0VvDk.jpg",
      quality: "FULLHD",
      type: "DUB"
    },
    {
      id: 4,
      title: "Guardiões da Galáxia: Volume 3",
      year: "2023",
      duration: "150min",
      image: "https://image.tmdb.org/t/p/w500/mgFdvrwlzM6xRaPAFYiVj3G7ou4.jpg",
      quality: "4K",
      type: "DUB"
    },
    {
      id: 5,
      title: "Homem-Aranha: Através do Aranhaverso",
      year: "2023",
      duration: "140min",
      image: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      quality: "FULLHD",
      type: "LEG"
    },
     {
      id: 6,
      title: "Oppenheimer",
      year: "2023",
      duration: "180min",
      image: "https://image.tmdb.org/t/p/w500/c0DCmfLh6Lh3SRs372GN7b0EHaC.jpg",
      quality: "4K",
      type: "DUB"
    },
    {
      id: 7,
      title: "Barbie",
      year: "2023",
      duration: "114min",
      image: "https://image.tmdb.org/t/p/w500/yRRuLt7sMB0xOSjBlwPNOo50G56.jpg",
      quality: "FULLHD",
      type: "LEG"
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
      type: "DUB"
    },
    {
      id: 2,
      title: "Wandinha",
      year: "2022",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/ooBR3q49rorFe72OiAyH3W9Xhcb.jpg",
      quality: "FULLHD",
      type: "DUB"
    },
    {
      id: 3,
      title: "The Mandalorian",
      year: "2023",
      duration: "S3 E8",
      image: "https://image.tmdb.org/t/p/w500/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg",
      quality: "4K",
      type: "LEG"
    },
    {
      id: 4,
      title: "Succession",
      year: "2023",
      duration: "S4 E10",
      image: "https://image.tmdb.org/t/p/w500/x5tY3UEKSeS7K2EML0zJcR0aN2r.jpg",
      quality: "FULLHD",
      type: "LEG"
    },
    {
      id: 5,
      title: "Loki",
      year: "2023",
      duration: "S2 E6",
      image: "https://image.tmdb.org/t/p/w500/voHU2TwK2x355TzT5v3QvfC54g.jpg",
      quality: "4K",
      type: "DUB"
    },
    {
      id: 6,
      title: "Ahsoka",
      year: "2023",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/laN1B5S4FX8b99Vd6n272YOvzo9.jpg",
      quality: "FULLHD",
      type: "DUB"
    },
    {
      id: 7,
      title: "Gen V",
      year: "2023",
      duration: "S1 E8",
      image: "https://image.tmdb.org/t/p/w500/sH32Tf9UBxM2Q0adq2jP0nPU27q.jpg",
      quality: "4K",
      type: "LEG"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <div className="px-4 md:px-8 lg:px-16 py-8 md:py-12"> 
          <ContentCarouselWrapper 
            title="Filmes" 
            data={moviesData}
            categories={["LANÇAMENTOS", "MAIS VISTOS", "EM ALTA", "RECOMENDADOS"]}
          />
          <div className="my-8 md:my-12"> 
            <ContentCarouselWrapper 
              title="Séries" 
              data={seriesData}
              categories={["NOVOS EPISÓDIOS", "MAIS VISTAS", "EM ALTA", "RECOMENDADAS"]}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
