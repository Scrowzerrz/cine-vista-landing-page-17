import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TVShowHeader from '@/components/tvshow/TVShowHeader';
import TVShowInfo from '@/components/tvshow/TVShowInfo';
import RelatedShows from '@/components/tvshow/RelatedShows';
import Comments from '@/components/movie/Comments';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Play, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const TVShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedSeason, setSelectedSeason] = useState("1");
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulação do carregamento da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
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

  const currentSeason = tvshow.seasons.find(season => season.number.toString() === selectedSeason) || tvshow.seasons[0];

  // Animação para cards de episódios
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08
      }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      } 
    }
  };

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
              
              {/* Seasons and Episodes - Redesigned */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-12 bg-gray-900/30 backdrop-blur-md p-10 rounded-3xl border border-gray-700/30 shadow-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                  <h3 className="text-3xl font-bold flex items-center">
                    <div className="mr-4 p-2 bg-red-600 rounded-xl">
                      <Play className="h-6 w-6" fill="white" />
                    </div>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">Temporadas e Episódios</span>
                  </h3>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-700/50 shadow-lg"
                  >
                    <p className="text-gray-300 font-medium">
                      <span className="text-red-400 font-semibold">{tvshow.seasons.length}</span> Temporadas • <span className="text-red-400 font-semibold">{
                      tvshow.seasons.reduce((total, season) => total + season.episodes.length, 0)
                    }</span> Episódios
                    </p>
                  </motion.div>
                </div>
                
                <Tabs value={selectedSeason} onValueChange={setSelectedSeason} className="w-full">
                  <div className="relative">
                    <ScrollArea className="w-full overflow-visible">
                      <TabsList className="mb-10 w-full flex flex-nowrap justify-start bg-gray-800/40 p-2 gap-2 rounded-2xl border border-gray-700/30 shadow-inner">
                        {tvshow.seasons.map((season) => (
                          <TabsTrigger 
                            key={season.number} 
                            value={season.number.toString()}
                            className="rounded-xl px-6 py-3.5 whitespace-nowrap flex-shrink-0 transition-all duration-300
                            data-[state=active]:bg-red-600/90 data-[state=active]:text-white data-[state=active]:shadow-2xl
                            data-[state=active]:shadow-red-600/20 data-[state=inactive]:bg-gray-800/80 
                            data-[state=inactive]:hover:bg-gray-700/70 font-bold tracking-wide"
                          >
                            Temporada {season.number}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </ScrollArea>
                  </div>
                  
                  {tvshow.seasons.map((season) => (
                    <TabsContent key={season.number} value={season.number.toString()} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          transition: { duration: 0.4 } 
                        }}
                        className="p-6 bg-gray-800/40 rounded-2xl border border-gray-700/40 mb-8"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 flex items-center justify-center bg-red-600 text-white rounded-xl shadow-xl">
                              <span className="font-bold text-xl">{season.number}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">Temporada {season.number}</h3>
                              <p className="text-sm text-gray-300">{season.year} • {season.episodes.length} episódios</p>
                            </div>
                          </div>
                          <Badge className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold rounded-lg shadow-lg">
                            {season.year}
                          </Badge>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-5"
                      >
                        {season.episodes.map((episode) => (
                          <motion.div
                            key={episode.number}
                            variants={cardVariants}
                            className="bg-gradient-to-r from-gray-800/70 to-gray-800/40 border border-gray-700/30 rounded-2xl overflow-hidden hover:border-red-600/50 transition-all duration-300 shadow-lg hover:shadow-red-900/10 hover:shadow-xl group"
                          >
                            <Collapsible className="w-full overflow-hidden">
                              <div className="flex flex-col md:flex-row">
                                <div className="md:w-52 h-32 md:h-auto relative overflow-hidden group-hover:brightness-110">
                                  <img 
                                    src={episode.image} 
                                    alt={episode.title}
                                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent transition-opacity duration-300 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <Button variant="default" size="sm" className="bg-red-600/90 hover:bg-red-700 rounded-full h-12 w-12 flex items-center justify-center shadow-xl">
                                        <Play className="h-5 w-5" fill="white" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 pt-5 w-full">
                                  <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                      <Badge className="bg-red-600 hover:bg-red-700 px-3 py-1 text-sm rounded-lg">{episode.number}</Badge>
                                      <h4 className="font-semibold text-lg text-white tracking-tight">{episode.title}</h4>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-300 gap-4">
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-gray-400" /> {episode.runtime}
                                      </span>
                                    </div>
                                    
                                    <CollapsibleTrigger className="text-sm text-red-400 hover:text-red-300 mt-3 flex items-center gap-2 cursor-pointer transition-colors border-none focus:border-none focus:outline-none">
                                      <span className="text-sm font-medium">Ver detalhes</span>
                                      <ChevronDown className="h-4 w-4 text-red-400 transition-transform duration-200 ui-open:rotate-180" />
                                    </CollapsibleTrigger>
                                  </div>
                                  
                                  <Button size="lg" className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 rounded-full px-6 py-5 transform transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20 hover:translate-y-[-2px]">
                                    <Play className="w-5 h-5 mr-2" fill="white" /> Assistir
                                  </Button>
                                </div>
                              </div>
                              
                              <CollapsibleContent className="animate-accordion-down">
                                <div className="px-5 pb-6 pt-0">
                                  <div className="p-5 rounded-xl bg-gray-800/50 border border-gray-700/50 shadow-inner">
                                    <h5 className="text-sm font-medium text-gray-200 mb-3">Sinopse:</h5>
                                    <p className="text-gray-300 text-sm leading-relaxed">{episode.overview}</p>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
              
              {/* Related TV Shows - Kept but redesigned */}
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
