
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
  episodeNumber: z.number(),
  title: z.string().min(1, "Episode title is required"),
  playerUrl: z.string().url("Invalid player URL"),
  duration: z.string().min(1, "Episode duration is required"),
});

const seasonSchema = z.object({
  seasonNumber: z.number(),
  numberOfEpisodes: z.number().min(0),
  episodes: z.array(episodeSchema),
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
  totalSeasons: z.number().min(1, 'Deve ter pelo menos 1 temporada'),
  network: z.string().optional(),
  creator: z.string().optional(),
  actors: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  producers: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  seasons: z.array(seasonSchema).optional(), // Optional for now, will be populated from state
});

type TVShowFormData = z.infer<typeof tvshowSchema>;

const TVShowUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [actors, setActors] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);
  const [seasons, setSeasons] = useState<Array<{ seasonNumber: number; numberOfEpisodes: number; episodes: Array<{ episodeNumber: number; title: string; playerUrl: string; duration: string }> }>>([{ seasonNumber: 1, numberOfEpisodes: 0, episodes: [] }]);

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
      totalSeasons: 1,
      network: '',
      creator: '',
    }
  });

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

  const handleTotalSeasonsChange = (newTotalSeasons: number) => {
    form.setValue('totalSeasons', newTotalSeasons);
    setSeasons(currentSeasons => {
      const currentLength = currentSeasons.length;
      if (newTotalSeasons > currentLength) {
        const newSeasonsToAdd = Array.from({ length: newTotalSeasons - currentLength }, (_, i) => ({
          seasonNumber: currentLength + i + 1,
          numberOfEpisodes: 0,
          episodes: [],
        }));
        return [...currentSeasons, ...newSeasonsToAdd];
      } else if (newTotalSeasons < currentLength) {
        return currentSeasons.slice(0, newTotalSeasons);
      }
      return currentSeasons;
    });
  };

  const handleNumberOfEpisodesChange = (seasonIndex: number, newNumberOfEpisodes: number) => {
    setSeasons(currentSeasons => {
      const updatedSeasons = [...currentSeasons];
      const season = updatedSeasons[seasonIndex];
      if (season) {
        season.numberOfEpisodes = newNumberOfEpisodes;
        const currentEpisodeCount = season.episodes.length;
        if (newNumberOfEpisodes > currentEpisodeCount) {
          const episodesToAdd = Array.from({ length: newNumberOfEpisodes - currentEpisodeCount }, (_, i) => ({
            episodeNumber: currentEpisodeCount + i + 1,
            title: '',
            playerUrl: '',
            duration: '',
          }));
          season.episodes = [...season.episodes, ...episodesToAdd];
        } else if (newNumberOfEpisodes < currentEpisodeCount) {
          season.episodes = season.episodes.slice(0, newNumberOfEpisodes);
        }
      }
      return updatedSeasons;
    });
  };

  const handleEpisodeDetailChange = (seasonIndex: number, episodeIndex: number, fieldName: string, value: string) => {
    setSeasons(currentSeasons => {
      const updatedSeasons = [...currentSeasons];
      const season = updatedSeasons[seasonIndex];
      if (season && season.episodes[episodeIndex]) {
        (season.episodes[episodeIndex] as any)[fieldName] = value;
      }
      return updatedSeasons;
    });
  };

  const onSubmit = async (data: TVShowFormData) => {
    setLoading(true);

    // Prepare the full data object including seasons from state
    const fullTVShowData = {
      ...data,
      actors: actors.filter(a => a.trim()),
      directors: directors.filter(d => d.trim()),
      producers: producers.filter(p => p.trim()),
      categories: categories.filter(c => c.trim()),
      seasons: seasons.map(s => ({
        seasonNumber: s.seasonNumber,
        numberOfEpisodes: s.numberOfEpisodes, // This is for UI logic, not directly stored in `season` table if schema is just id, tvshow_id, season_number
        episodes: s.episodes.map(e => ({
          episodeNumber: e.episodeNumber,
          title: e.title,
          playerUrl: e.playerUrl,
          duration: e.duration,
        }))
      })),
    };

    // Validate the full data structure including seasons and episodes
    try {
      tvshowSchema.parse(fullTVShowData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("Validation errors:", validationError.errors);
        // Construct a user-friendly error message
        const errorMessages = validationError.errors.map(err => {
          const path = err.path.join('.');
          // Customize messages for nested season/episode fields
          if (path.startsWith('seasons')) {
            const [, seasonIndex, field, episodeIndex, episodeField] = err.path;
            if (episodeField) { // Error within an episode
              return `Temporada ${Number(seasonIndex) + 1}, Episódio ${Number(episodeIndex) + 1}, Campo '${episodeField}': ${err.message}`;
            } else { // Error within a season (e.g. numberOfEpisodes, or episode array itself)
              return `Temporada ${Number(seasonIndex) + 1}, Campo '${field}': ${err.message}`;
            }
          }
          return `${path}: ${err.message}`;
        });
        toast({
          title: "Erro de Validação",
          description: "Por favor, corrija os seguintes erros: " + errorMessages.join('; '),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro de Validação",
          description: "Ocorreu um erro inesperado durante a validação.",
          variant: "destructive",
        });
      }
      setLoading(false);
      return;
    }

    try {
      // Insert tvshow (main details)
      const { data: tvshowData, error: tvshowError } = await supabase
        .from('tvshows')
        .insert({
          title: fullTVShowData.title,
          original_title: fullTVShowData.originalTitle || null,
          year: fullTVShowData.year,
          rating: fullTVShowData.rating,
          quality: fullTVShowData.quality,
          plot: fullTVShowData.plot,
          poster: fullTVShowData.poster,
          backdrop: fullTVShowData.backdrop,
          total_seasons: fullTVShowData.totalSeasons, // This comes from the form
          network: fullTVShowData.network || null,
          creator: fullTVShowData.creator || null,
        })
        .select()
        .single();

      if (tvshowError) throw tvshowError;
      const tvshowId = tvshowData.id;

      // Insert actors
      if (fullTVShowData.actors && fullTVShowData.actors.length > 0) {
        for (const actorName of fullTVShowData.actors) {
          const { data: actorData, error: actorError } = await supabase
            .from('actors')
            .upsert({ name: actorName.trim() }, { onConflict: 'name' })
            .select().single();
          if (actorError) { console.error('Actor insert error:', actorError); throw actorError; }
          if (actorData) {
            const { error: tvshowActorError } = await supabase.from('tvshow_actors').insert({ tvshow_id: tvshowId, actor_id: actorData.id });
            if (tvshowActorError) { console.error('TVShow_Actor insert error:', tvshowActorError); throw tvshowActorError; }
          }
        }
      }

      // Insert directors
      if (fullTVShowData.directors && fullTVShowData.directors.length > 0) {
        for (const directorName of fullTVShowData.directors) {
          const { data: directorData, error: directorError } = await supabase
            .from('directors')
            .upsert({ name: directorName.trim() }, { onConflict: 'name' })
            .select().single();
          if (directorError) { console.error('Director insert error:', directorError); throw directorError; }
          if (directorData) {
            const { error: tvshowDirectorError } = await supabase.from('tvshow_directors').insert({ tvshow_id: tvshowId, director_id: directorData.id });
            if (tvshowDirectorError) { console.error('TVShow_Director insert error:', tvshowDirectorError); throw tvshowDirectorError; }
          }
        }
      }

      // Insert producers
      if (fullTVShowData.producers && fullTVShowData.producers.length > 0) {
        for (const producerName of fullTVShowData.producers) {
          const { data: producerData, error: producerError } = await supabase
            .from('producers')
            .upsert({ name: producerName.trim() }, { onConflict: 'name' })
            .select().single();
          if (producerError) { console.error('Producer insert error:', producerError); throw producerError; }
          if (producerData) {
            const { error: tvshowProducerError } = await supabase.from('tvshow_producers').insert({ tvshow_id: tvshowId, producer_id: producerData.id });
            if (tvshowProducerError) { console.error('TVShow_Producer insert error:', tvshowProducerError); throw tvshowProducerError; }
          }
        }
      }

      // Insert categories
      if (fullTVShowData.categories && fullTVShowData.categories.length > 0) {
        for (const categoryName of fullTVShowData.categories) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .upsert({ name: categoryName.trim() }, { onConflict: 'name' })
            .select().single();
          if (categoryError) { console.error('Category insert error:', categoryError); throw categoryError; }
          if (categoryData) {
            const { error: tvshowCategoryError } = await supabase.from('tvshow_categories').insert({ tvshow_id: tvshowId, category_id: categoryData.id });
            if (tvshowCategoryError) { console.error('TVShow_Category insert error:', tvshowCategoryError); throw tvshowCategoryError; }
          }
        }
      }

      // Insert seasons and episodes
      for (const season of fullTVShowData.seasons) {
        // Validate each season (already done by tvshowSchema.parse, but good for clarity)
        // seasonSchema.parse(season);

        const { data: seasonData, error: seasonError } = await supabase
          .from('seasons')
          .insert({
            tvshow_id: tvshowId,
            season_number: season.seasonNumber,
            // numberOfEpisodes is not part of the 'seasons' table schema based on the prompt
          })
          .select()
          .single();

        if (seasonError) { console.error('Season insert error:', seasonError); throw seasonError; }
        const seasonId = seasonData.id;

        for (const episode of season.episodes) {
          // Validate each episode (already done by tvshowSchema.parse)
          // episodeSchema.parse(episode);

          const { error: episodeError } = await supabase
            .from('episodes')
            .insert({
              season_id: seasonId,
              episode_number: episode.episodeNumber,
              title: episode.title,
              player_url: episode.playerUrl,
              duration: episode.duration,
            });
          if (episodeError) { console.error('Episode insert error:', episodeError); throw episodeError; }
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Série e todos os seus dados foram adicionados com sucesso!',
      });

      // Reset form and state
      form.reset(); // Resets react-hook-form fields
      setActors(['']);
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);
      // Reset seasons state to initial
      setSeasons([{ seasonNumber: 1, numberOfEpisodes: 0, episodes: [] }]);
      // totalSeasons is part of form.reset(), but ensure it's explicitly set if needed
      form.setValue('totalSeasons', 1);

    } catch (error) {
      console.error('Error uploading tvshow:', error);
      let description = 'Erro ao adicionar série. Tente novamente.';
      // Attempt to get a more specific error message from Supabase or Zod
      if (error instanceof Error) {
        description = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        description = String((error as {message: string}).message);
      }

      toast({
        title: 'Erro no Envio',
        description: description,
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
                    <FormLabel className="text-white">Total de Temporadas *</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        min="1"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value) && value > 0) {
                            handleTotalSeasonsChange(value);
                          } else {
                            handleTotalSeasonsChange(1); // Reset to 1 if input is invalid
                          }
                        }}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
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

            {/* Seasons and Episodes */}
            <div className="space-y-6">
              {seasons.map((season, seasonIndex) => (
                <Card key={season.seasonNumber} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">Temporada {season.seasonNumber}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor={`season-${season.seasonNumber}-episodes`} className="text-white">Número de Episódios</Label>
                      <Input
                        id={`season-${season.seasonNumber}-episodes`}
                        type="number"
                        min="0"
                        value={season.numberOfEpisodes}
                        onChange={(e) => handleNumberOfEpisodesChange(seasonIndex, parseInt(e.target.value) || 0)}
                        className="bg-gray-700 border-gray-600 text-white mt-1"
                      />
                    </div>

                    {season.episodes.map((episode, episodeIndex) => (
                      <Card key={episodeIndex} className="bg-gray-750 border-gray-650 p-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Episódio {episode.episodeNumber}</h4>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`episode-${season.seasonNumber}-${episode.episodeNumber}-title`} className="text-white">Título do Episódio</Label>
                            <Input
                              id={`episode-${season.seasonNumber}-${episode.episodeNumber}-title`}
                              value={episode.title}
                              onChange={(e) => handleEpisodeDetailChange(seasonIndex, episodeIndex, 'title', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white mt-1"
                              placeholder="Título do Episódio"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`episode-${season.seasonNumber}-${episode.episodeNumber}-playerUrl`} className="text-white">URL do Player</Label>
                            <Input
                              id={`episode-${season.seasonNumber}-${episode.episodeNumber}-playerUrl`}
                              type="url"
                              value={episode.playerUrl}
                              onChange={(e) => handleEpisodeDetailChange(seasonIndex, episodeIndex, 'playerUrl', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white mt-1"
                              placeholder="https://example.com/player"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`episode-${season.seasonNumber}-${episode.episodeNumber}-duration`} className="text-white">Duração</Label>
                            <Input
                              id={`episode-${season.seasonNumber}-${episode.episodeNumber}-duration`}
                              value={episode.duration}
                              onChange={(e) => handleEpisodeDetailChange(seasonIndex, episodeIndex, 'duration', e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white mt-1"
                              placeholder="ex: 22 min"
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

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
