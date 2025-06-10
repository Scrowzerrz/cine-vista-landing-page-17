
import React, { useState } from 'react';
import { Upload, Tv, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const episodeSchema = z.object({
  episode_number: z.number().min(1),
  title: z.string().min(1, 'Título do episódio é obrigatório'),
  player_url: z.string().url('URL do player inválida'),
  poster: z.string().url('URL do poster inválida').optional().or(z.literal('')),
  overview: z.string().min(1, 'Sinopse do episódio é obrigatória'),
  runtime: z.string().min(1, 'Duração do episódio é obrigatória'),
});

const seasonSchema = z.object({
  season_number: z.number().min(1),
  year: z.string().min(4, 'Ano deve ter 4 dígitos'),
  episodes: z.array(episodeSchema).min(1, 'A temporada deve ter pelo menos um episódio'),
});

const tvshowSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  originalTitle: z.string().optional(),
  year: z.string().min(4, 'Ano deve ter 4 dígitos'),
  rating: z.string().min(1, 'Classificação é obrigatória'),
  quality: z.string().min(1, 'Qualidade é obrigatória'),
  plot: z.string().min(10, 'Sinopse deve ter pelo menos 10 caracteres'),
  poster: z.string().url('URL do poster inválida'),
  backdrop: z.string().url('URL do backdrop inválida'),
  network: z.string().optional(),
  creator: z.string().optional(),
  actors: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  producers: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  seasons: z.array(seasonSchema).min(1, 'A série deve ter pelo menos uma temporada'),
});

type TVShowFormData = z.infer<typeof tvshowSchema>;

// Define types for Season and Episode based on state structure, not Zod schema directly for flexibility with partial data during input
interface EpisodeState {
  episode_number: number;
  title: string;
  player_url: string;
  poster: string;
  overview: string;
  runtime: string;
}

interface SeasonState {
  season_number: number;
  year: string;
  episodes: EpisodeState[];
}

const TVShowUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [actors, setActors] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);

  const initialEpisode: EpisodeState = { episode_number: 1, title: '', player_url: '', poster: '', overview: '', runtime: '' };
  const initialSeason: SeasonState = { season_number: 1, year: '', episodes: [initialEpisode] };
  const [seasons, setSeasons] = useState<SeasonState[]>([initialSeason]);

  const form = useForm<TVShowFormData>({
    resolver: zodResolver(tvshowSchema),
    defaultValues: {
      title: '',
      originalTitle: '',
      year: new Date().getFullYear().toString(),
      rating: '',
      quality: 'HD',
      plot: '',
      poster: '',
      backdrop: '',
      network: '',
      creator: '',
      // seasons will be handled by the 'seasons' state, but Zod expects it in the submitted data
      // We will provide it from the state in onSubmit
    }
  });

  // SEASONS AND EPISODES HANDLERS
  const handleSeasonChange = (seasonIndex: number, field: keyof Omit<SeasonState, 'episodes' | 'season_number'>, value: string) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex][field] = value;
    setSeasons(updatedSeasons);
  };

  const handleEpisodeChange = (seasonIndex: number, episodeIndex: number, field: keyof Omit<EpisodeState, 'episode_number'>, value: string) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes[episodeIndex][field] = value;
    setSeasons(updatedSeasons);
  };

  const addSeason = () => {
    setSeasons([
      ...seasons,
      {
        season_number: seasons.length + 1,
        year: '',
        episodes: [{ episode_number: 1, title: '', player_url: '', poster: '', overview: '', runtime: '' }],
      },
    ]);
  };

  const removeSeason = (seasonIndex: number) => {
    if (seasons.length > 1) {
      const updatedSeasons = seasons.filter((_, index) => index !== seasonIndex);
      // Re-number seasons
      setSeasons(updatedSeasons.map((season, index) => ({ ...season, season_number: index + 1 })));
    } else {
      toast({ title: "Atenção", description: "A série deve ter pelo menos uma temporada.", variant: "default" });
    }
  };

  const addEpisode = (seasonIndex: number) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[seasonIndex].episodes.push({
      episode_number: updatedSeasons[seasonIndex].episodes.length + 1,
      title: '',
      player_url: '',
      poster: '',
      overview: '',
      runtime: '',
    });
    setSeasons(updatedSeasons);
  };

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    const updatedSeasons = [...seasons];
    if (updatedSeasons[seasonIndex].episodes.length > 1) {
      updatedSeasons[seasonIndex].episodes = updatedSeasons[seasonIndex].episodes.filter(
        (_, index) => index !== episodeIndex
      );
      // Re-number episodes
      updatedSeasons[seasonIndex].episodes = updatedSeasons[seasonIndex].episodes.map((ep, index) => ({
        ...ep,
        episode_number: index + 1,
      }));
      setSeasons(updatedSeasons);
    } else {
      toast({ title: "Atenção", description: "A temporada deve ter pelo menos um episódio.", variant: "default" });
    }
  };


  const addField = (field: 'actors' | 'directors' | 'producers' | 'categories') => {
    switch (field) {
      case 'actors':
        setActors([...actors, '']);
        break;
      case 'directors':
        setDirectors([...directors, '']);
        break;
      case 'producers':
        setProducers([...producers, '']);
        break;
      case 'categories':
        setCategories([...categories, '']);
        break;
    }
  };

  const removeField = (field: 'actors' | 'directors' | 'producers' | 'categories', index: number) => {
    switch (field) {
      case 'actors':
        setActors(actors.filter((_, i) => i !== index));
        break;
      case 'directors':
        setDirectors(directors.filter((_, i) => i !== index));
        break;
      case 'producers':
        setProducers(producers.filter((_, i) => i !== index));
        break;
      case 'categories':
        setCategories(categories.filter((_, i) => i !== index));
        break;
    }
  };

  const updateField = (field: 'actors' | 'directors' | 'producers' | 'categories', index: number, value: string) => {
    switch (field) {
      case 'actors':
        const newActors = [...actors];
        newActors[index] = value;
        setActors(newActors);
        break;
      case 'directors':
        const newDirectors = [...directors];
        newDirectors[index] = value;
        setDirectors(newDirectors);
        break;
      case 'producers':
        const newProducers = [...producers];
        newProducers[index] = value;
        setProducers(newProducers);
        break;
      case 'categories':
        const newCategories = [...categories];
        newCategories[index] = value;
        setCategories(newCategories);
        break;
    }
  };

  const onSubmit = async (formData: TVShowFormData) => {
    setLoading(true);
    try {
      // Validate seasons data manually or ensure it's correctly typed for Zod
      const validatedSeasons = seasons.map(s => ({
        ...s,
        episodes: s.episodes.map(e => ({
          ...e,
          episode_number: Number(e.episode_number),
        })),
        season_number: Number(s.season_number),
      }));

      const finalData = { ...formData, seasons: validatedSeasons };
      // This will throw if finalData (including seasons from state) is invalid
      tvshowSchema.parse(finalData);


      // Insert tvshow
      const { data: tvshowData, error: tvshowError } = await supabase
        .from('tvshows')
        .insert({
          title: finalData.title,
          original_title: finalData.originalTitle || null,
          year: finalData.year, // Main show year, can be first season's year or distinct
          rating: finalData.rating,
          quality: finalData.quality,
          plot: finalData.plot,
          poster: finalData.poster,
          backdrop: finalData.backdrop,
          // total_seasons and total_episodes are removed, will be derived if needed or stored differently
          network: finalData.network || null,
          creator: finalData.creator || null,
        })
        .select()
        .single();

      if (tvshowError) {
        console.error('Supabase TVShow Insert Error:', tvshowError);
        throw new Error(`Erro ao registrar os dados principais da série: ${tvshowError.message}. Por favor, verifique os campos do formulário.`);
      }
      if (!tvshowData) throw new Error('Falha ao registrar a série: nenhum dado retornado pelo servidor.');

      const tvshowId = tvshowData.id;
      const tvshowTitle = finalData.title;

      // Loop through seasons from state
      for (const season of validatedSeasons) {
        try {
          const { data: seasonData, error: seasonError } = await supabase
            .from('seasons')
            .insert({
              tvshow_id: tvshowId,
              season_number: season.season_number,
              year: season.year,
              episode_count: season.episodes.length,
            })
            .select()
            .single();

          if (seasonError) {
            console.error(`Supabase Season ${season.season_number} Insert Error:`, seasonError);
            throw new Error(`Erro ao adicionar Temporada ${season.season_number} para '${tvshowTitle}': ${seasonError.message}.`);
          }
          if (!seasonData) throw new Error(`Falha ao adicionar Temporada ${season.season_number} para '${tvshowTitle}', nenhum dado retornado.`);

          const seasonId = seasonData.id;

          // Loop through episodes for the current season
          for (const episode of season.episodes) {
            try {
              const { error: episodeError } = await supabase
                .from('episodes')
                .insert({
                  season_id: seasonId,
                  episode_number: episode.episode_number,
                  title: episode.title,
                  player_url: episode.player_url,
                  poster: episode.poster || null,
                  overview: episode.overview,
                  runtime: episode.runtime,
                });

              if (episodeError) {
                console.error(`Supabase Episode ${episode.episode_number} (S${season.season_number}) Insert Error:`, episodeError);
                throw new Error(`Erro ao adicionar Episódio ${episode.episode_number} da Temporada ${season.season_number} para '${tvshowTitle}': ${episodeError.message}.`);
              }
            } catch (epError) {
              // Catch and rethrow to be caught by the outer season catch, or the main catch
              // This ensures the toast displays a specific episode error.
              const specificEpError = epError instanceof Error ? epError.message : String(epError);
              toast({ title: 'Erro no Episódio', description: specificEpError, variant: 'destructive' });
              throw epError; // Rethrow to stop further processing within this season and trigger outer catch
            }
          }
        } catch (sError) {
            // Catch and rethrow to be caught by the main catch
            // This ensures the toast displays a specific season error.
            const specificSeasonError = sError instanceof Error ? sError.message : String(sError);
            toast({ title: 'Erro na Temporada', description: specificSeasonError, variant: 'destructive' });
            throw sError; // Rethrow to stop further processing and trigger main catch
        }
      }

      // Insert actors (assuming actors state and logic remains similar)
      if (actors.some(actor => actor.trim())) {
        const actorNames = actors.filter(actor => actor.trim());
        for (const actorName of actorNames) {
          const { data: actorData, error: actorError } = await supabase
            .from('actors')
            .upsert({ name: actorName.trim() }, { onConflict: 'name' })
            .select()
            .single();

          if (!actorError && actorData) {
            await supabase
              .from('tvshow_actors')
              .insert({ tvshow_id: tvshowId, actor_id: actorData.id });
          }
        }
      }

      // Insert directors
      if (directors.some(director => director.trim())) {
        const directorNames = directors.filter(director => director.trim());
        for (const directorName of directorNames) {
          const { data: directorData, error: directorError } = await supabase
            .from('directors')
            .upsert({ name: directorName.trim() }, { onConflict: 'name' })
            .select()
            .single();

          if (!directorError && directorData) {
            await supabase
              .from('tvshow_directors')
              .insert({ tvshow_id: tvshowId, director_id: directorData.id });
          }
        }
      }

      // Insert producers
      if (producers.some(producer => producer.trim())) {
        const producerNames = producers.filter(producer => producer.trim());
        for (const producerName of producerNames) {
          const { data: producerData, error: producerError } = await supabase
            .from('producers')
            .upsert({ name: producerName.trim() }, { onConflict: 'name' })
            .select()
            .single();

          if (!producerError && producerData) {
            await supabase
              .from('tvshow_producers')
              .insert({ tvshow_id: tvshowId, producer_id: producerData.id });
          }
        }
      }

      // Insert categories
      if (categories.some(category => category.trim())) {
        const categoryNames = categories.filter(category => category.trim());
        for (const categoryName of categoryNames) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .upsert({ name: categoryName.trim() }, { onConflict: 'name' })
            .select()
            .single();

          if (!categoryError && categoryData) {
            await supabase
              .from('tvshow_categories')
              .insert({ tvshow_id: tvshowId, category_id: categoryData.id });
          }
        }
      }

      toast({
        title: 'Sucesso!',
        description: `Série '${tvshowTitle}' e todos os seus dados foram adicionados com sucesso!`,
      });

      // Reset form
      form.reset({ // Reset react-hook-form
        title: '',
        originalTitle: '',
        year: new Date().getFullYear().toString(),
        rating: '',
        quality: 'HD',
        plot: '',
        poster: '',
        backdrop: '',
        network: '',
        creator: '',
      });
      setActors(['']); // Reset local state for actors, etc.
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);
      setSeasons([ // Reset seasons to initial state
        { season_number: 1, year: '', episodes: [{ episode_number: 1, title: '', player_url: '', poster: '', overview: '', runtime: '' }] }
      ]);


    } catch (error: any) {
      console.error('Error uploading tvshow (outer catch):', error);
      // Check if a toast has already been shown by inner catches for season/episode errors
      // This is a simple check; more sophisticated state management for toasts might be needed if errors could overlap.
      // However, since inner errors rethrow, this outer catch will likely display the more specific error message.
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado ao adicionar a série. Por favor, tente novamente.';

      // Only show generic error if a specific one (from season/episode) hasn't been shown
      // This logic might be tricky if toasts don't prevent subsequent ones.
      // For now, the rethrown error will be caught here and its message displayed.
      toast({
        title: 'Erro na Adição da Série',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFieldArray = (
    title: string,
    field: 'actors' | 'directors' | 'producers' | 'categories',
    values: string[]
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-white">{title}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addField(field)}
          className="text-gray-300 border-gray-600 hover:bg-gray-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar
        </Button>
      </div>
      {values.map((value, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => updateField(field, index, e.target.value)}
            placeholder={`Nome ${title.toLowerCase().slice(0, -1)}`}
            className="bg-gray-800 border-gray-600 text-white"
          />
          {values.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeField(field, index)}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Tv className="w-5 h-5" />
          Adicionar Série
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Título *</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="originalTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Título Original</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Ano *</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Classificação *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: 8.5" className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Qualidade *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: HD, 4K" className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalSeasons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Rede/Canal</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: Netflix, HBO" className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="network"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Rede/Canal</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: Netflix, HBO" className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Criador</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="plot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Sinopse *</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} className="bg-gray-800 border-gray-600 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="poster"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">URL do Poster *</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="backdrop"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">URL do Backdrop *</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" className="bg-gray-800 border-gray-600 text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFieldArray('Atores', 'actors', actors)}
              {renderFieldArray('Diretores', 'directors', directors)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFieldArray('Produtores', 'producers', producers)}
              {renderFieldArray('Categorias', 'categories', categories)}
            </div>

            {/* SEASONS AND EPISODES DYNAMIC FORM */}
            <div className="space-y-6">
              <Label className="text-xl font-semibold text-white">Temporadas e Episódios</Label>
              {seasons.map((season, seasonIndex) => (
                <Card key={seasonIndex} className="bg-gray-800 border-gray-700 p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium text-white">Temporada {season.season_number}</Label>
                    {seasons.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSeason(seasonIndex)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <X className="w-4 h-4 mr-1" /> Remover Temporada
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label htmlFor={`season-year-${seasonIndex}`} className="text-sm text-gray-300">Ano da Temporada</Label>
                    <Input
                      id={`season-year-${seasonIndex}`}
                      type="number"
                      value={season.year}
                      onChange={(e) => handleSeasonChange(seasonIndex, 'year', e.target.value)}
                      placeholder="Ex: 2023"
                      className="bg-gray-700 border-gray-600 text-white mt-1"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-md font-medium text-gray-200">Episódios</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addEpisode(seasonIndex)}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Adicionar Episódio
                      </Button>
                    </div>
                    {season.episodes.map((episode, episodeIndex) => (
                      <Card key={episodeIndex} className="bg-gray-750 border-gray-650 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                           <Label className="text-sm font-medium text-gray-300">Episódio {episode.episode_number}</Label>
                           {season.episodes.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="xs"
                              onClick={() => removeEpisode(seasonIndex, episodeIndex)}
                              className="text-red-500 hover:text-red-400 hover:bg-red-900/30 px-2 py-1"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`ep-title-${seasonIndex}-${episodeIndex}`} className="text-xs text-gray-400">Título do Episódio</Label>
                            <Input
                              id={`ep-title-${seasonIndex}-${episodeIndex}`}
                              value={episode.title}
                              onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'title', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white text-sm mt-1"
                              placeholder="Título do Episódio"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`ep-runtime-${seasonIndex}-${episodeIndex}`} className="text-xs text-gray-400">Duração</Label>
                            <Input
                              id={`ep-runtime-${seasonIndex}-${episodeIndex}`}
                              value={episode.runtime}
                              onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'runtime', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white text-sm mt-1"
                              placeholder="Ex: 25 min"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`ep-playerurl-${seasonIndex}-${episodeIndex}`} className="text-xs text-gray-400">URL do Player</Label>
                          <Input
                            id={`ep-playerurl-${seasonIndex}-${episodeIndex}`}
                            type="url"
                            value={episode.player_url}
                            onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'player_url', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white text-sm mt-1"
                            placeholder="URL do Player"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`ep-poster-${seasonIndex}-${episodeIndex}`} className="text-xs text-gray-400">URL do Poster do Episódio (Opcional)</Label>
                          <Input
                            id={`ep-poster-${seasonIndex}-${episodeIndex}`}
                            type="url"
                            value={episode.poster}
                            onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'poster', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white text-sm mt-1"
                            placeholder="URL do Poster do Episódio"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`ep-overview-${seasonIndex}-${episodeIndex}`} className="text-xs text-gray-400">Sinopse do Episódio</Label>
                          <Textarea
                            id={`ep-overview-${seasonIndex}-${episodeIndex}`}
                            value={episode.overview}
                            onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'overview', e.target.value)}
                            rows={2}
                            className="bg-gray-700 border-gray-600 text-white text-sm mt-1"
                            placeholder="Sinopse do Episódio"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addSeason}
                className="w-full text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-2" /> Adicionar Temporada
              </Button>
            </div>
            {/* END SEASONS AND EPISODES DYNAMIC FORM */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Adicionando...' : 'Adicionar Série'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TVShowUpload;
