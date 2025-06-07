
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
import { saveTvShow, saveSeason, saveEpisode } from '@/services/uploadService'; // Importando as novas funções

const tvshowSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  originalTitle: z.string().optional(),
  year: z.string().min(4, 'Ano deve ter 4 dígitos'),
  rating: z.string().min(1, 'Classificação é obrigatória'),
  quality: z.string().min(1, 'Qualidade é obrigatória'),
  plot: z.string().min(10, 'Sinopse deve ter pelo menos 10 caracteres'),
  poster: z.string().url('URL do poster inválida'),
  backdrop: z.string().url('URL do backdrop inválida'),
  // totalSeasons e totalEpisodes removidos
  network: z.string().optional(),
  creator: z.string().optional(),
  formSeasons: z.array(
    z.object({
      season_number: z.number({ required_error: "Número da temporada é obrigatório" }).min(1, 'Número da temporada deve ser no mínimo 1'),
      title: z.string().optional(),
      episodes: z.array(z.object({
        episode_number: z.number({ required_error: "Número do episódio é obrigatório" }).min(1, "Número do episódio deve ser no mínimo 1"),
        title: z.string({ required_error: "Título do episódio é obrigatório" }).min(1, "Título do episódio é obrigatório"),
        synopsis: z.string().optional(),
        poster_url: z.string().url("URL do poster do episódio inválida").optional(),
        backdrop_url: z.string().url("URL do backdrop do episódio inválida").optional(),
        video_url: z.string({ required_error: "URL do vídeo é obrigatória" }).url("URL do vídeo do episódio inválida").min(1, "URL do vídeo é obrigatória"),
        duration_minutes: z.number().min(0, "Duração não pode ser negativa").optional().nullable(), // .nullable() para permitir omissão
      })).min(1, "Cada temporada deve ter pelo menos um episódio.").optional(), // .min(1) para exigir pelo menos um episódio
    })
  ).optional(),
  actors: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  producers: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
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
      // totalSeasons e totalEpisodes removidos
      network: '',
      creator: '',
      formSeasons: [{
        season_number: 1,
        title: '',
        episodes: [{
          episode_number: 1,
          title: '',
          video_url: '',
          synopsis: '',
          poster_url: '',
          backdrop_url: '',
          duration_minutes: null // Default para null
        }]
      }],
    }
  });

  // Configuração do useFieldArray para formSeasons
  const { fields: seasonFields, append: appendSeason, remove: removeSeason } = useFieldArray({
    control: form.control,
    name: "formSeasons"
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

  const onSubmit = async (formData: TVShowFormData) => {
    setLoading(true);
    console.log('Submitting form data:', formData);

    // Definição do valor padrão para formSeasons ao resetar
    const defaultFormSeasonsValue = [{
      season_number: 1,
      title: '',
      episodes: [{
        episode_number: 1,
        title: '',
        video_url: '',
        synopsis: '',
        poster_url: '',
        backdrop_url: '',
        duration_minutes: null
      }]
    }];

    try {
      // 1. Salvar os dados principais da TV Show
      const tvShowPayload = {
        title: formData.title,
        originalTitle: formData.originalTitle, // No serviço: original_title
        year: formData.year,                   // No serviço: release_year (convertido para int)
        rating: formData.rating,
        quality: formData.quality,
        plot: formData.plot,                   // No serviço: synopsis
        poster: formData.poster,               // No serviço: poster_url
        backdrop: formData.backdrop,           // No serviço: backdrop_url
        network: formData.network,
        creator: formData.creator,
      };
      // O serviço saveTvShow espera os nomes dos campos como estão no formulário/Zod,
      // e ele mesmo faz o mapeamento para os nomes das colunas do BD.
      const savedTvShow = await saveTvShow(tvShowPayload);

      if (!savedTvShow || !savedTvShow.id) {
        throw new Error("Falha ao salvar a série ou obter seu ID.");
      }
      const tvShowId = savedTvShow.id;

      // 2. Salvar atores, diretores, etc. (lógica existente, adaptada para usar tvShowId)
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
        description: 'Série adicionada com sucesso!',
      });

      // 3. Iterar e salvar temporadas e seus episódios
      if (formData.formSeasons && formData.formSeasons.length > 0) {
        for (const seasonFormData of formData.formSeasons) {
          if (!seasonFormData) continue; // Segurança extra

          const seasonPayload = {
            season_number: seasonFormData.season_number,
            title: seasonFormData.title,
            // Outros campos da temporada, se você os coletar (ex: poster_url, synopsis da temporada)
            // poster_url: seasonFormData.poster_url, (se existir no form)
            // synopsis: seasonFormData.synopsis, (se existir no form)
          };
          const savedSeason = await saveSeason(seasonPayload, tvShowId);

          if (!savedSeason || !savedSeason.id) {
            throw new Error("Falha ao salvar a temporada ou obter seu ID.");
          }
          const seasonId = savedSeason.id;

          if (seasonFormData.episodes && seasonFormData.episodes.length > 0) {
            for (const episodeFormData of seasonFormData.episodes) {
              if (!episodeFormData) continue; // Segurança extra

              const episodePayload = {
                episode_number: episodeFormData.episode_number,
                title: episodeFormData.title,
                synopsis: episodeFormData.synopsis,
                video_url: episodeFormData.video_url,
                poster_url: episodeFormData.poster_url,
                backdrop_url: episodeFormData.backdrop_url,
                duration_minutes: episodeFormData.duration_minutes,
              };
              await saveEpisode(episodePayload, seasonId);
            }
          }
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Série e seus detalhes foram adicionados com sucesso!',
      });

      // Resetar o formulário e estados
      form.reset(); // Reseta os valores para defaultValues
      // Os defaultValues já incluem a estrutura inicial de formSeasons, então useFieldArray deve resetar.
      // Se for necessário forçar o reset do useFieldArray para o estado inicial exato:
      form.setValue('formSeasons', defaultFormSeasonsValue);

      setActors(['']);
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);

    } catch (error) {
      console.error('Error uploading full tvshow:', error);
      let errorMessage = 'Erro ao adicionar a série completa. Verifique o console.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Erro no Envio',
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

            {/* Seção para Gerenciamento de Temporadas */}
            <div className="space-y-4 p-4 border border-gray-700 rounded-md">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Temporadas</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSeason({
                    season_number: seasonFields.length + 1,
                    title: '',
                    episodes: [{ // Adicionado episódio padrão ao adicionar nova temporada
                      episode_number: 1,
                      title: '',
                      video_url: '',
                      synopsis: '',
                      poster_url: '',
                      backdrop_url: '',
                      duration_minutes: null
                    }]
                  })}
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Temporada
                </Button>
              </div>
              {seasonFields.map((seasonItem, seasonIndex) => {
                // Configuração do useFieldArray para episodes DENTRO do map de seasons
                const {
                  fields: episodeFields,
                  append: appendEpisode,
                  remove: removeEpisode
                } = useFieldArray({
                  control: form.control,
                  name: `formSeasons.${seasonIndex}.episodes`
                });

                return (
                <div key={seasonItem.id} className="space-y-3 p-3 border border-gray-700 rounded-md bg-gray-800/20">
                  {/* Campos da Temporada */}
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`formSeasons.${seasonIndex}.season_number`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-white">Número da Temporada *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              placeholder="Ex: 1"
                              onChange={(e) => field.onChange(parseInt(e.target.value, 10) || undefined)}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`formSeasons.${seasonIndex}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-white">Título da Temporada</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ex: O Início"
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSeason(seasonIndex)}
                      disabled={seasonFields.length === 1}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2 md:mt-7"
                    >
                      <X className="w-4 h-4 mr-1 md:mr-0" /> <span className="md:hidden">Remover Temporada</span>
                    </Button>
                  </div>

                  {/* Seção para Gerenciamento de Episódios */}
                  <div className="ml-0 md:ml-4 mt-4 space-y-3 border-t border-gray-700 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-md font-semibold text-gray-200">Episódios</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => appendEpisode({
                          episode_number: episodeFields.length + 1,
                          title: '',
                          video_url: '',
                          synopsis: '',
                          poster_url: '',
                          backdrop_url: '',
                          duration_minutes: null
                        })}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700 text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Adicionar Episódio
                      </Button>
                    </div>

                    {episodeFields.map((episodeItem, episodeIndex) => (
                      <div key={episodeItem.id} className="p-3 border border-gray-600 rounded-md space-y-3 bg-gray-700/40">
                        <div className="flex items-center justify-between">
                           <h5 className="text-sm font-semibold text-gray-300">
                             Episódio {form.getValues(`formSeasons.${seasonIndex}.episodes.${episodeIndex}.episode_number`)}
                           </h5>
                           <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => removeEpisode(episodeIndex)}
                            disabled={episodeFields.length === 1}
                            className="text-red-500 hover:text-red-400 text-xs p-1"
                          >
                            <X className="w-3 h-3 mr-1" /> <span className="hidden sm:inline">Remover</span>
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.episode_number`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-gray-400">Número do Episódio *</FormLabel>
                                <FormControl>
                                  <Input {...field} type="number" min="1" onChange={(e) => field.onChange(parseInt(e.target.value,10) || undefined)} className="bg-gray-600 border-gray-500 text-white text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-gray-400">Título do Episódio *</FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-gray-600 border-gray-500 text-white text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.video_url`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-400">URL do Vídeo *</FormLabel>
                              <FormControl>
                                <Input {...field} type="url" placeholder="https://" className="bg-gray-600 border-gray-500 text-white text-sm" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.synopsis`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-400">Sinopse do Episódio</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={2} className="bg-gray-600 border-gray-500 text-white text-sm" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           <FormField
                            control={form.control}
                            name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.poster_url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-gray-400">URL Poster Episódio</FormLabel>
                                <FormControl>
                                  <Input {...field} type="url" placeholder="https://" className="bg-gray-600 border-gray-500 text-white text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.backdrop_url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-xs text-gray-400">URL Backdrop Episódio</FormLabel>
                                <FormControl>
                                  <Input {...field} type="url" placeholder="https://" className="bg-gray-600 border-gray-500 text-white text-sm" />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.duration_minutes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-gray-400">Duração (minutos)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" min="0" onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10) || 0)} className="bg-gray-600 border-gray-500 text-white text-sm" />
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                     {form.formState.errors.formSeasons?.[seasonIndex]?.episodes?.root?.message && (
                        <p className="text-sm font-medium text-destructive">{form.formState.errors.formSeasons?.[seasonIndex]?.episodes?.root?.message}</p>
                    )}
                    {form.formState.errors.formSeasons?.[seasonIndex]?.episodes && !form.formState.errors.formSeasons?.[seasonIndex]?.episodes?.root && (
                        <p className="text-sm font-medium text-destructive">Verifique os erros nos campos dos episódios.</p>
                    )}
                  </div>
                </div>
                )
              })}
              {form.formState.errors.formSeasons?.root?.message && (
                 <p className="text-sm font-medium text-destructive">{form.formState.errors.formSeasons.root.message}</p>
              )}
               {form.formState.errors.formSeasons && !form.formState.errors.formSeasons.root && (
                <p className="text-sm font-medium text-destructive">Verifique os erros nos campos das temporadas.</p>
               )}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFieldArray('Atores', 'actors', actors)}
              {renderFieldArray('Diretores', 'directors', directors)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFieldArray('Produtores', 'producers', producers)}
              {renderFieldArray('Categorias', 'categories', categories)}
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
