
import React, { useState } from 'react';
import { Upload, Tv, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  seasons: z.array(
    z.object({
      numberOfEpisodes: z.string()
        .min(1, 'Required')
        .refine(val => /^\d+$/.test(val) && parseInt(val, 10) >= 0, { message: "Must be a non-negative number" }), // Allow 0 episodes initially
      episodes: z.array(
        z.object({
          title: z.string().min(1, 'Title is required'),
          plot: z.string().optional(),
          duration: z.string().min(1, 'Duration is required'),
          airDate: z.string().optional().refine((date) => !date || /^\d{4}-\d{2}-\d{2}$/.test(date), { message: "Air date must be in YYYY-MM-DD format or empty." }),
          playerUrl: z.string().url('Invalid player URL'),
          posterUrl: z.string().url('Invalid poster URL').optional(),
        })
      ),
    })
  ),
});

type TVShowFormData = z.infer<typeof tvshowSchema>;

const TVShowUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [actors, setActors] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);

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
      seasons: [],
    }
  });

  const { fields: seasonFields, append: appendSeason, remove: removeSeason } = useFieldArray({
    control: form.control,
    name: "seasons",
  });

  // Watch for changes in totalSeasons to update the seasons array
  const totalSeasons = form.watch('totalSeasons');

  React.useEffect(() => {
    const currentSeasonsLength = seasonFields.length;
    if (totalSeasons > currentSeasonsLength) {
      for (let i = currentSeasonsLength; i < totalSeasons; i++) {
        appendSeason({ numberOfEpisodes: '1', episodes: [] });
      }
    } else if (totalSeasons < currentSeasonsLength) {
      for (let i = currentSeasonsLength; i > totalSeasons; i--) {
        removeSeason(i - 1);
      }
    }
  }, [totalSeasons, appendSeason, removeSeason, seasonFields.length]);

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

  const onSubmit = async (data: TVShowFormData) => {
    setLoading(true);
    try {
      // Calculate total episodes
      const total_episodes = data.seasons.reduce((acc, season) => acc + (parseInt(season.numberOfEpisodes, 10) || 0), 0);

      // Insert tvshow
      const { data: tvshowData, error: tvshowError } = await supabase
        .from('tvshows')
        .insert({
          title: data.title,
          original_title: data.originalTitle || null,
          year: data.year,
          rating: data.rating,
          quality: data.quality,
          plot: data.plot,
          poster: data.poster,
          backdrop: data.backdrop,
          total_seasons: data.totalSeasons,
          total_episodes: total_episodes, // Calculated total episodes
          network: data.network || null,
          creator: data.creator || null,
        })
        .select()
        .single();

      if (tvshowError) {
        console.error('Error inserting TV show:', tvshowError);
        throw new Error(`Failed to insert TV show: ${tvshowError.message}`);
      }
      if (!tvshowData) {
        throw new Error('No data returned after inserting TV show.');
      }

      const tvshowId = tvshowData.id;

      // Insert seasons and episodes
      for (let seasonIndex = 0; seasonIndex < data.seasons.length; seasonIndex++) {
        const currentSeason = data.seasons[seasonIndex];
        const { data: seasonData, error: seasonError } = await supabase
          .from('seasons')
          .insert({
            tvshow_id: tvshowId,
            season_number: seasonIndex + 1,
            // title: currentSeason.title, // Add if season title is implemented in form
          })
          .select()
          .single();

        if (seasonError) {
          console.error(`Error inserting season ${seasonIndex + 1}:`, seasonError);
          throw new Error(`Failed to insert season ${seasonIndex + 1}: ${seasonError.message}`);
        }
        if (!seasonData) {
          throw new Error(`No data returned after inserting season ${seasonIndex + 1}.`);
        }

        const seasonId = seasonData.id;

        for (let episodeIndex = 0; episodeIndex < currentSeason.episodes.length; episodeIndex++) {
          const currentEpisode = currentSeason.episodes[episodeIndex];
          const airDate = currentEpisode.airDate ? currentEpisode.airDate : null; // Ensure null if empty

          const { error: episodeError } = await supabase
            .from('episodes')
            .insert({
              season_id: seasonId,
              episode_number: episodeIndex + 1,
              title: currentEpisode.title,
              plot: currentEpisode.plot || null,
              duration: currentEpisode.duration,
              air_date: airDate,
              player_url: currentEpisode.playerUrl,
              poster_url: currentEpisode.posterUrl || null,
            });

          if (episodeError) {
            console.error(`Error inserting episode ${episodeIndex + 1} for season ${seasonIndex + 1}:`, episodeError);
            throw new Error(`Failed to insert episode ${episodeIndex + 1} for season ${seasonIndex + 1}: ${episodeError.message}`);
          }
        }
      }

      // Insert actors
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
        description: 'Série de TV e todos os seus episódios foram adicionados com sucesso!',
      });

      // Reset form
      form.reset();
      setActors(['']);
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);
      // Reset seasons to initial state (e.g., one season by default if totalSeasons defaults to 1)
      // This will be handled by form.reset() and useEffect for totalSeasons

    } catch (error: any) { // Catch any error to access error.message
      console.error('Error uploading TV show and its details:', error);
      toast({
        title: 'Erro no Upload',
        description: error.message || 'Ocorreu um erro ao adicionar a série ou seus episódios. Verifique os logs e tente novamente.',
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
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
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

            {/* Seasons and Episodes Fields */}
            <div className="space-y-6">
              {seasonFields.map((season, seasonIndex) => (
                <Card key={season.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Temporada {seasonIndex + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`seasons.${seasonIndex}.numberOfEpisodes`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Número de Episódios</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              className="bg-gray-700 border-gray-600 text-white"
                              onChange={(e) => {
                                const newNumberOfEpisodes = parseInt(e.target.value, 10) || 0;
                                field.onChange(String(newNumberOfEpisodes));
                                // Adjust episodes array for this season - implemented below
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <EpisodesSection seasonIndex={seasonIndex} control={form.control} watch={form.watch} />
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

// Helper component to manage episodes for a season
const EpisodesSection: React.FC<{ seasonIndex: number; control: any; watch: any }> = ({ seasonIndex, control, watch }) => {
  const { fields: episodeFields, append: appendEpisode, remove: removeEpisode } = useFieldArray({
    control,
    name: `seasons.${seasonIndex}.episodes`,
  });

  const numberOfEpisodesStr = watch(`seasons.${seasonIndex}.numberOfEpisodes`);
  const numberOfEpisodes = parseInt(numberOfEpisodesStr, 10) || 0;

  React.useEffect(() => {
    const currentEpisodesLength = episodeFields.length;
    if (numberOfEpisodes > currentEpisodesLength) {
      for (let i = currentEpisodesLength; i < numberOfEpisodes; i++) {
        appendEpisode({
          title: '',
          plot: '',
          duration: '',
          airDate: '',
          playerUrl: '',
          posterUrl: '',
        });
      }
    } else if (numberOfEpisodes < currentEpisodesLength) {
      for (let i = currentEpisodesLength; i > numberOfEpisodes; i--) {
        removeEpisode(i - 1);
      }
    }
  }, [numberOfEpisodes, appendEpisode, removeEpisode, episodeFields.length]);

  return (
    <div className="space-y-4 pl-4 border-l-2 border-gray-600">
      {episodeFields.map((episode, episodeIndex) => (
        <div key={episode.id} className="p-3 bg-gray-750 rounded-md">
          <h4 className="text-md font-semibold text-gray-200 mb-3">Episódio {episodeIndex + 1}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`seasons.${seasonIndex}.episodes.${episodeIndex}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-300">Título do Episódio</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-700 border-gray-600 text-white text-sm" placeholder="Ex: Pilot" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`seasons.${seasonIndex}.episodes.${episodeIndex}.duration`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-300">Duração (ex: 45m)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-700 border-gray-600 text-white text-sm" placeholder="Ex: 45m" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`seasons.${seasonIndex}.episodes.${episodeIndex}.playerUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-300">URL do Player</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" className="bg-gray-700 border-gray-600 text-white text-sm" placeholder="https://example.com/player" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`seasons.${seasonIndex}.episodes.${episodeIndex}.posterUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-300">URL do Poster do Episódio (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" className="bg-gray-700 border-gray-600 text-white text-sm" placeholder="https://example.com/poster.jpg"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`seasons.${seasonIndex}.episodes.${episodeIndex}.airDate`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-300">Data de Lançamento (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="bg-gray-700 border-gray-600 text-white text-sm" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:col-span-2">
              <FormField
                control={control}
                name={`seasons.${seasonIndex}.episodes.${episodeIndex}.plot`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-gray-300">Sinopse do Episódio (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} className="bg-gray-700 border-gray-600 text-white text-sm" placeholder="Breve resumo do episódio..."/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};