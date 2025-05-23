
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Calendar, Clock, Star, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';

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
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      } 
    })
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white selection:bg-red-500 selection:text-white">
      <Navbar />
      
      <main className="pt-16">
        {/* Show Background with Gradient Overlay */}
        <div 
          className="relative w-full h-[500px] md:h-[600px] lg:h-[70vh] bg-cover bg-center transition-all duration-700"
          style={{ 
            backgroundImage: `url(${tvshow.backdrop})`, 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 via-gray-900/70 to-gray-900"></div>
          
          <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
            <TVShowHeader tvshow={tvshow} />
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              {/* TV Show Info */}
              <TVShowInfo tvshow={tvshow} />
              
              {/* Seasons and Episodes */}
              <div className="mt-8 bg-gradient-to-br from-gray-800/70 to-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl animate-fade-in">
                <h3 className="text-2xl font-bold mb-8 flex items-center">
                  <span className="inline-block w-1.5 h-8 bg-red-600 mr-3 rounded"></span>
                  Temporadas e Episódios
                </h3>
                
                <Tabs value={selectedSeason} onValueChange={setSelectedSeason} className="w-full">
                  <ScrollArea className="w-full">
                    <TabsList className="mb-8 w-full overflow-x-auto flex flex-nowrap justify-start bg-gray-900/60 p-1.5 gap-2 rounded-xl">
                      {tvshow.seasons.map((season) => (
                        <TabsTrigger 
                          key={season.number} 
                          value={season.number.toString()}
                          className="rounded-lg px-6 py-3 whitespace-nowrap flex-shrink-0 transition-all 
                          data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg
                          data-[state=active]:shadow-red-500/20 data-[state=inactive]:bg-gray-800/60 
                          data-[state=inactive]:hover:bg-gray-800/80 font-medium"
                        >
                          Temporada {season.number}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </ScrollArea>
                  
                  {tvshow.seasons.map((season) => (
                    <TabsContent key={season.number} value={season.number.toString()} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                      <div className="flex items-center justify-between mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                        <div>
                          <h3 className="text-xl font-bold text-white">Temporada {season.number}</h3>
                          <p className="text-sm text-gray-300">{season.year} • {season.episodes.length} episódios</p>
                        </div>
                        <Badge className="bg-red-600 px-3 py-1 text-sm font-medium">
                          {season.year}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {season.episodes.map((episode, index) => (
                          <motion.div
                            key={episode.number}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                          >
                            <Card className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 border-gray-700/50 overflow-hidden hover:border-red-600/70 transition-all duration-300 rounded-xl shadow-lg hover:shadow-red-900/20 hover:shadow-xl">
                              <Collapsible className="w-full">
                                <div className="flex flex-col md:flex-row gap-4 p-0">
                                  <div className="md:w-48 h-28 md:h-auto relative group">
                                    <img 
                                      src={episode.image} 
                                      alt={episode.title}
                                      className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                      <Button variant="default" size="sm" className="bg-red-600/90 hover:bg-red-700 rounded-full aspect-square p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <Play className="h-5 w-5" fill="white" />
                                      </Button>
                                    </div>
                                  </div>
                                  <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 pt-5 w-full">
                                    <div className="flex-grow">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-red-600 hover:bg-red-700 px-2.5 py-0.5 text-sm">{episode.number}</Badge>
                                        <h4 className="font-semibold text-lg text-white tracking-tight">{episode.title}</h4>
                                      </div>
                                      <div className="flex items-center text-sm text-gray-300 gap-4">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-4 h-4 text-gray-400" /> {episode.runtime}
                                        </span>
                                      </div>
                                      
                                      <CollapsibleTrigger className="text-sm text-red-400 hover:text-red-300 mt-3 flex items-center gap-1.5 cursor-pointer transition-colors">
                                        <span className="text-sm font-medium">Ver detalhes</span>
                                        <ChevronDown className="h-4 w-4 text-red-400 transition-transform duration-200 ui-open:rotate-180" />
                                      </CollapsibleTrigger>
                                    </div>
                                    
                                    <Button variant="default" size="lg" className="mt-3 md:mt-0 bg-red-600 hover:bg-red-700 rounded-full px-6 py-5 transform transition-all duration-300 hover:shadow-lg hover:shadow-red-600/20 hover:translate-y-[-2px]">
                                      <Play className="w-5 h-5 mr-2" fill="white" /> Assistir
                                    </Button>
                                  </CardContent>
                                </div>
                                
                                <CollapsibleContent className="animate-accordion-down">
                                  <div className="px-5 pb-5 pt-0">
                                    <div className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50">
                                      <h5 className="text-sm font-medium text-gray-200 mb-2">Sinopse:</h5>
                                      <p className="text-gray-300 text-sm leading-relaxed">{episode.overview}</p>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              
              {/* Stream Options */}
              <div className="mt-8 bg-gradient-to-br from-gray-800/70 to-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <span className="inline-block w-1.5 h-8 bg-red-600 mr-3 rounded"></span>
                  Opções para Assistir
                </h3>
                
                <div className="space-y-3">
                  {tvshow.links.map((link, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between py-4 px-5 border-b border-gray-700/50 last:border-0 hover:bg-gray-800/30 rounded-lg transition-all duration-200 group"
                    >
                      <span className="text-gray-200 group-hover:text-white transition-colors">{link.label}</span>
                      <Button 
                        variant="default" 
                        className="bg-red-600 hover:bg-red-700 rounded-full transform transition-all duration-300 hover:scale-105 px-6"
                      >
                        <Play className="mr-2 h-4 w-4" fill="white" /> Assistir
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Related TV Shows */}
              <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <RelatedShows shows={relatedShows} />
              </div>
              
              {/* Comments Section */}
              <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Comments />
              </div>
            </div>
            
            {/* Sidebar with Related Content */}
            <div className="md:col-span-1">
              <div className="bg-gradient-to-br from-gray-800/70 to-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl sticky top-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-lg font-bold mb-5 flex items-center">
                  <span className="inline-block w-1 h-6 bg-red-600 mr-2 rounded"></span>
                  Recomendações
                </h3>
                
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4 pr-2">
                    {relatedShows.map((show, index) => (
                      <motion.div 
                        key={show.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        className="flex space-x-3 p-2 rounded-lg hover:bg-gray-800/40 transition-colors group cursor-pointer"
                      >
                        <div className="relative w-16 h-24 overflow-hidden rounded-lg">
                          <img 
                            src={show.image} 
                            alt={show.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                        <div className="flex flex-col justify-between">
                          <div>
                            <h4 className="font-medium text-sm leading-tight group-hover:text-red-400 transition-colors">{show.title}</h4>
                            <p className="text-xs text-gray-400">{show.year} • {show.duration}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Badge variant="outline" className="text-[10px] h-4 bg-gray-700/70 border-gray-600">
                              {show.quality}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] h-4 bg-blue-600/20 text-blue-400 border-blue-800">
                              {show.type}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
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
