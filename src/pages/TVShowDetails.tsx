import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TVShowHeader from '@/components/tvshow/TVShowHeader';
import TVShowInfo from '@/components/tvshow/TVShowInfo';
import RelatedShows from '@/components/tvshow/RelatedShows';
import Comments from '@/components/movie/Comments';
import SeasonsAndEpisodes from '@/components/tvshow/SeasonsAndEpisodes';
import { motion } from 'framer-motion';

const TVShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSeason, setSelectedSeason] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEpisodes, setExpandedEpisodes] = useState<Record<string, boolean>>({});
  
  // Simulação do carregamento da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Toggle expanded episodes state
  const toggleExpandEpisodes = (seasonNumber: string) => {
    setExpandedEpisodes(prev => ({
      ...prev,
      [seasonNumber]: !prev[seasonNumber]
    }));
  };
  
  // Simulação de dados da série (em produção, isso viria de uma API ou Supabase)
  const tvshow = {
    id: id || '1',
    title: 'BREAKING BAD',
    originalTitle: 'Breaking Bad',
    year: '2008-2013',
    rating: '9.5',
    poster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    quality: 'HD',
    categories: ['Drama', 'Crime', 'Thriller'],
    creator: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Dean Norris', 'Betsy Brandt'],
    network: 'AMC',
    plot: 'Um professor de química do ensino médio diagnosticado com câncer de pulmão inoperável se volta para a fabricação e venda de metanfetamina para garantir o futuro financeiro de sua família.',
    seasons: [
      {
        number: 1,
        year: "2008",
        episodes: [
          { number: 1, title: "Piloto", runtime: "58min", overview: "O professor de química Walter White recebe um diagnóstico de câncer terminal e decide produzir metanfetamina para sustentar sua família.", image: "https://image.tmdb.org/t/p/w300/ydlY3iPfeOAvu8gVqrxPoMvzNCn.jpg" },
          { number: 2, title: "O Gato Está no Saco", runtime: "48min", overview: "Walt e Jesse precisam lidar com as consequências do seu primeiro negócio de drogas.", image: "https://image.tmdb.org/t/p/w300/tjDNvbokPLtEnpFyFPyXMOd6Zr1.jpg" },
          { number: 3, title: "E o Saco Está no Rio", runtime: "48min", overview: "Walt e Jesse precisam limpar a bagunça que fizeram para evitar serem descobertos.", image: "https://image.tmdb.org/t/p/w300/2kBeT92bnmfVRGrx9iVMkB0P8fU.jpg" },
          { number: 4, title: "Homem Destruído", runtime: "48min", overview: "Walt começa a lidar com os efeitos colaterais da quimioterapia e decide contar à sua família sobre sua doença.", image: "https://image.tmdb.org/t/p/w300/jYJSPZWYyPVkWQAQJnZlbP7HYw4.jpg" },
          { number: 5, title: "Matéria Cinzenta", runtime: "48min", overview: "Walt rejeita a ajuda financeira de um antigo amigo para seu tratamento do câncer.", image: "https://image.tmdb.org/t/p/w300/5Fii1JRJS2n0naJELAPUQvKdAhu.jpg" },
          { number: 6, title: "Louco Punhado de Nada", runtime: "48min", overview: "Walt apriora seu produto e começa a vender para um novo distribuidor, o psicótico Tuco.", image: "https://image.tmdb.org/t/p/w300/lFfhX1UmWWZDoKkHVzSQvZelCtj.jpg" },
          { number: 7, title: "Um Trato Sem Igual", runtime: "48min", overview: "Walter e Jesse enfrentam um roubo em seu laboratório, levando-os a criar uma nova droga para Tuco.", image: "https://image.tmdb.org/t/p/w300/1VvwM41LWHfqDXUxFgn3d8TKUYr.jpg" }
        ]
      },
      {
        number: 2,
        year: "2009",
        episodes: [
          { number: 1, title: "Sete Trinta e Sete", runtime: "47min", overview: "Walt e Jesse são forçados a lidar com um Tuco cada vez mais descontrolado.", image: "https://image.tmdb.org/t/p/w300/hyFoSFtQvF9V4aBzJ6TGHrei5Wc.jpg" },
          { number: 2, title: "Grilled", runtime: "47min", overview: "Tuco sequestra Walt e Jesse e os leva para uma casa isolada no deserto.", image: "https://image.tmdb.org/t/p/w300/zbDg5s62hXMuhKgHWW0ABQp1uKi.jpg" },
          { number: 3, title: "Bit by a Dead Bee", runtime: "47min", overview: "Walt e Jesse precisam cobrir seus rastros e criar álibis depois do encontro com Tuco.", image: "https://image.tmdb.org/t/p/w300/4qQrIHhh8MAXScCIgLJ9SgBuIxX.jpg" }
        ]
      },
      {
        number: 3,
        year: "2010",
        episodes: [
          { number: 1, title: "No Más", runtime: "47min", overview: "Walt tenta reconciliar-se com Skyler e se afastar do negócio de drogas.", image: "https://image.tmdb.org/t/p/w300/1Zg9appj8Wgww5Fell8fs9tOIRv.jpg" },
          { number: 2, title: "Caballo Sin Nombre", runtime: "47min", overview: "Walt tenta voltar para casa, mas Skyler não está disposta a esquecer seus crimes.", image: "https://image.tmdb.org/t/p/w300/uJmQsMSHKJIn7iM1ijnMHnw7Bm6.jpg" }
        ]
      },
      {
        number: 4,
        year: "2011",
        episodes: [
          { number: 1, title: "Box Cutter", runtime: "47min", overview: "Walt e Jesse enfrentam as consequências do assassinato de Gale.", image: "https://image.tmdb.org/t/p/w300/7LuImm5dQ3XBq6o9YdcNpGWOimI.jpg" }
        ]
      },
      {
        number: 5,
        year: "2012-2013",
        episodes: [
          { number: 1, title: "Live Free or Die", runtime: "47min", overview: "Walt, Jesse e Mike trabalham para eliminar provas contra eles.", image: "https://image.tmdb.org/t/p/w300/n3YrVrGXnQkAXTyF9N6MXSgShqt.jpg" },
          { number: 16, title: "Felina", runtime: "55min", overview: "O episódio final da série. Walter White volta a Albuquerque para acertar as contas.", image: "https://image.tmdb.org/t/p/w300/q7CpzyPvZp8hUrRrnfAsCjPYMt8.jpg" }
        ]
      }
    ],
    links: [
      { label: 'Assistir Breaking Bad Online Dublado', type: 'DUB' },
      { label: 'Assistir Breaking Bad Online Legendado', type: 'LEG' },
      { label: 'Assistir Breaking Bad Online em HD', type: 'HD' },
      { label: 'Assistir Breaking Bad Online Grátis', type: 'FREE' },
    ]
  };

  const relatedShows = [
    {
      id: '2',
      title: 'Better Call Saul',
      year: '2015-2022',
      duration: '6 Temporadas',
      image: 'https://image.tmdb.org/t/p/w500/fC2HDm5t0kHl7mTm7jxMR1sOAHk.jpg',
      quality: 'HD',
      type: 'LEG'
    },
    {
      id: '3',
      title: 'Ozark',
      year: '2017-2022',
      duration: '4 Temporadas',
      image: 'https://image.tmdb.org/t/p/w500/sgxawbFB5Vi5OkPWQLNfl3dvkNJ.jpg',
      quality: 'HD',
      type: 'DUB'
    },
    {
      id: '4',
      title: 'Narcos',
      year: '2015-2017',
      duration: '3 Temporadas',
      image: 'https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg',
      quality: 'HD',
      type: 'DUB'
    },
    {
      id: '5',
      title: 'The Sopranos',
      year: '1999-2007',
      duration: '6 Temporadas',
      image: 'https://image.tmdb.org/t/p/w500/6nNZnnUkXcI3DvdrkclulanYXzg.jpg',
      quality: 'HD',
      type: 'DUB'
    },
    {
      id: '6',
      title: 'The Wire',
      year: '2002-2008',
      duration: '5 Temporadas',
      image: 'https://image.tmdb.org/t/p/w500/4lbclFySvugI51fwsyxBTOm4DqK.jpg',
      quality: 'HD',
      type: 'DUB'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-950 min-h-screen text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Show Background with Gradient Overlay */}
        <div 
          className="relative w-full h-[500px] md:h-[600px] lg:h-[70vh] bg-cover bg-center bg-fixed transition-all duration-700"
          style={{ 
            backgroundImage: `url(${tvshow.backdrop})`, 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/80 to-gray-950"></div>
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-16">
            <TVShowHeader tvshow={tvshow} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-3">
              {/* TV Show Info */}
              <TVShowInfo tvshow={tvshow} />
              
              {/* Seasons and Episodes */}
              <SeasonsAndEpisodes 
                seasons={tvshow.seasons}
                selectedSeason={selectedSeason}
                setSelectedSeason={setSelectedSeason}
                expandedEpisodes={expandedEpisodes}
                toggleExpandEpisodes={toggleExpandEpisodes}
              />
              
              {/* Related TV Shows */}
              <div className="mt-12">
                <RelatedShows shows={relatedShows} />
              </div>
              
              {/* Comments Section */}
              <div className="mt-12">
                <Comments />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TVShowDetails;
