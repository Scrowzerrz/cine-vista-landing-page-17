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
import { saveTvShow, saveSeason, saveEpisode } from '@/services/uploadService';
import ControlledImageUpload from './ControlledImageUpload';
import ControlledVideoUpload from './ControlledVideoUpload'; // Importando ControlledVideoUpload

const tvshowSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  originalTitle: z.string().optional(),
  year: z.string().min(4, 'Ano deve ter 4 dígitos'),
  rating: z.string().min(1, 'Classificação é obrigatória'),
  quality: z.string().min(1, 'Qualidade é obrigatória'),
  plot: z.string().min(10, 'Sinopse deve ter pelo menos 10 caracteres'),
  poster: z.any()
    .optional()
    .nullable()
    .refine(value => {
      if (value === null || value === undefined) return true;
      if (value instanceof File) return value.type.startsWith('image/');
      if (typeof value === 'string') return value.trim() !== '' && z.string().url().safeParse(value).success;
      return false;
    }, { message: "Poster da série deve ser um arquivo de imagem válido ou uma URL válida." }),
  backdrop: z.any()
    .optional()
    .nullable()
    .refine(value => {
      if (value === null || value === undefined) return true;
      if (value instanceof File) return value.type.startsWith('image/');
      if (typeof value === 'string') return value.trim() !== '' && z.string().url().safeParse(value).success;
      return false;
    }, { message: "Backdrop da série deve ser um arquivo de imagem válido ou uma URL válida." }),
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
        poster_url: z.any()
          .optional()
          .nullable()
          .refine(value => {
            if (value === null || value === undefined) return true;
            if (value instanceof File) return value.type.startsWith('image/');
            if (typeof value === 'string') return value.trim() !== '' && z.string().url().safeParse(value).success;
            return false;
          }, { message: "Poster do episódio deve ser um arquivo de imagem válido ou uma URL válida." }),
        backdrop_url: z.any()
          .optional()
          .nullable()
          .refine(value => {
            if (value === null || value === undefined) return true;
            if (value instanceof File) return value.type.startsWith('image/');
            if (typeof value === 'string') return value.trim() !== '' && z.string().url().safeParse(value).success;
            return false;
          }, { message: "Backdrop do episódio deve ser um arquivo de imagem válido ou uma URL válida." }),
        video_url: z.any().refine(value =>
          (typeof value === 'string' && value.trim() !== '') || value instanceof File, {
          message: "Vídeo do episódio é obrigatório (URL ou arquivo).",
        }),
        duration_minutes: z.number().min(0, "Duração não pode ser negativa").optional().nullable(),
      })).min(1, "Cada temporada deve ter pelo menos um episódio.").optional(),
    })
  ).optional(),
  actors: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  producers: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

type TVShowFormData = z.infer<typeof tvshowSchema>;

// Define o valor padrão para um episódio
const getDefaultEpisodeValue = () => ({
  episode_number: 1,
  title: '',
  synopsis: '',
  poster_url: null,
  backdrop_url: null,
  video_url: null,
  duration_minutes: null,
});

// Define o valor padrão para uma temporada (incluindo um episódio padrão)
const getDefaultSeasonValue = () => ({
  season_number: 1,
  title: '',
  episodes: [getDefaultEpisodeValue()],
});


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
      poster: null,
      backdrop: null,
      network: '',
      creator: '',
      formSeasons: [getDefaultSeasonValue()], // Usando a função para o valor padrão
    }
  });

  const { fields: seasonFields, append: appendSeason, remove: removeSeason } = useFieldArray({
    control: form.control,
    name: "formSeasons"
  });

  const addField = (field: 'actors' | 'directors' | 'producers' | 'categories') => {
    const actions = {
      actors: () => setActors([...actors, '']),
      directors: () => setDirectors([...directors, '']),
      producers: () => setProducers([...producers, '']),
      categories: () => setCategories([...categories, '']),
    };
    actions[field]();
  };

  const removeField = (field: 'actors' | 'directors' | 'producers' | 'categories', index: number) => {
    const actions = {
      actors: () => setActors(actors.filter((_, i) => i !== index)),
      directors: () => setDirectors(directors.filter((_, i) => i !== index)),
      producers: () => setProducers(producers.filter((_, i) => i !== index)),
      categories: () => setCategories(categories.filter((_, i) => i !== index)),
    };
    actions[field]();
  };

  const updateField = (field: 'actors' | 'directors' | 'producers' | 'categories', index: number, value: string) => {
    const actions = {
      actors: () => { const newActors = [...actors]; newActors[index] = value; setActors(newActors); },
      directors: () => { const newDirectors = [...directors]; newDirectors[index] = value; setDirectors(newDirectors); },
      producers: () => { const newProducers = [...producers]; newProducers[index] = value; setProducers(newProducers); },
      categories: () => { const newCategories = [...categories]; newCategories[index] = value; setCategories(newCategories); },
    };
    actions[field]();
  };

  const onSubmit = async (formData: TVShowFormData) => {
    setLoading(true);
    console.log('Submitting form data:', formData);

    const defaultFormSeasonsValue = [getDefaultSeasonValue()];

    try {
      const tvShowPayload = {
        title: formData.title,
        originalTitle: formData.originalTitle,
        year: formData.year,
        rating: formData.rating,
        quality: formData.quality,
        plot: formData.plot,
        poster: formData.poster,
        backdrop: formData.backdrop,
        network: formData.network,
        creator: formData.creator,
      };
      const savedTvShow = await saveTvShow(tvShowPayload);
      if (!savedTvShow || !savedTvShow.id) throw new Error("Falha ao salvar a série ou obter seu ID.");
      const tvShowId = savedTvShow.id;

      // Lógica para atores, diretores, etc. (usando supabase diretamente por enquanto, como no original)
      const relatedDataActions = [
        ...actors.filter(name => name.trim()).map(name => ({ table: 'actors', data: { name: name.trim() }, linkTable: 'tvshow_actors', linkField: 'actor_id' })),
        ...directors.filter(name => name.trim()).map(name => ({ table: 'directors', data: { name: name.trim() }, linkTable: 'tvshow_directors', linkField: 'director_id' })),
        ...producers.filter(name => name.trim()).map(name => ({ table: 'producers', data: { name: name.trim() }, linkTable: 'tvshow_producers', linkField: 'producer_id' })),
        ...categories.filter(name => name.trim()).map(name => ({ table: 'categories', data: { name: name.trim() }, linkTable: 'tvshow_categories', linkField: 'category_id' })),
      ];

      for (const item of relatedDataActions) {
        const { data: relatedItemData, error: relatedItemError } = await supabase
          .from(item.table)
          .upsert(item.data, { onConflict: 'name' })
          .select()
          .single();
        if (relatedItemError) throw relatedItemError;
        if (relatedItemData) {
          await supabase.from(item.linkTable).insert({ tvshow_id: tvShowId, [item.linkField]: relatedItemData.id });
        }
      }
      // Fim da lógica de atores, etc.

      if (formData.formSeasons && formData.formSeasons.length > 0) {
        for (const seasonFormData of formData.formSeasons) {
          if (!seasonFormData) continue;
          const seasonPayload = {
            season_number: seasonFormData.season_number,
            title: seasonFormData.title,
          };
          const savedSeason = await saveSeason(seasonPayload, tvShowId);
          if (!savedSeason || !savedSeason.id) throw new Error("Falha ao salvar a temporada ou obter seu ID.");
          const seasonId = savedSeason.id;

          if (seasonFormData.episodes && seasonFormData.episodes.length > 0) {
            for (const episodeFormData of seasonFormData.episodes) {
              if (!episodeFormData) continue;
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

      toast({ title: 'Sucesso!', description: 'Série e seus detalhes foram adicionados com sucesso!' });
      form.reset();
      form.setValue('formSeasons', defaultFormSeasonsValue);
      setActors(['']); setDirectors(['']); setProducers(['']); setCategories(['']);
    } catch (error) {
      console.error('Error uploading full tvshow:', error);
      toast({ title: 'Erro no Envio', description: error instanceof Error ? error.message : 'Erro desconhecido', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const renderFieldArrayInputs = (
    title: string,
    fieldKey: 'actors' | 'directors' | 'producers' | 'categories',
    values: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-white">{title}</Label>
        <Button type="button" variant="outline" size="sm" onClick={() => setter([...values, ''])} className="text-gray-300 border-gray-600 hover:bg-gray-700">
          <Plus className="w-4 h-4 mr-1" /> Adicionar
        </Button>
      </div>
      {values.map((value, index) => (
        <div key={`${fieldKey}-${index}`} className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => {
              const newValues = [...values];
              newValues[index] = e.target.value;
              setter(newValues);
            }}
            placeholder={`Nome ${title.toLowerCase().slice(0, -1)}`}
            className="bg-gray-800 border-gray-600 text-white"
          />
          {values.length > 1 && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setter(values.filter((_, i) => i !== index))} className="text-red-400 hover:text-red-300 hover:bg-red-900/20">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );


  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader><CardTitle className="text-white flex items-center gap-2"><Tv className="w-5 h-5" />Adicionar Série</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel className="text-white">Título *</FormLabel><FormControl><Input {...field} className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="originalTitle" render={({ field }) => (<FormItem><FormLabel className="text-white">Título Original</FormLabel><FormControl><Input {...field} className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="year" render={({ field }) => (<FormItem><FormLabel className="text-white">Ano *</FormLabel><FormControl><Input {...field} type="number" className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="rating" render={({ field }) => (<FormItem><FormLabel className="text-white">Classificação *</FormLabel><FormControl><Input {...field} placeholder="ex: 8.5" className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="quality" render={({ field }) => (<FormItem><FormLabel className="text-white">Qualidade *</FormLabel><FormControl><Input {...field} placeholder="ex: HD, 4K" className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="network" render={({ field }) => (<FormItem><FormLabel className="text-white">Rede/Canal</FormLabel><FormControl><Input {...field} placeholder="ex: Netflix, HBO" className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="creator" render={({ field }) => (<FormItem><FormLabel className="text-white">Criador</FormLabel><FormControl><Input {...field} className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="plot" render={({ field }) => (<FormItem><FormLabel className="text-white">Sinopse *</FormLabel><FormControl><Textarea {...field} rows={4} className="bg-gray-800 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="poster" render={({ field }) => (<FormItem><FormLabel className="text-white">Poster da Série *</FormLabel><FormControl><ControlledImageUpload value={field.value} onChange={field.onChange} className="h-48 w-full" /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="backdrop" render={({ field }) => (<FormItem><FormLabel className="text-white">Backdrop da Série *</FormLabel><FormControl><ControlledImageUpload value={field.value} onChange={field.onChange} className="h-48 w-full" /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <div className="space-y-4 p-4 border border-gray-700 rounded-md">
              <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Temporadas</h3><Button type="button" variant="outline" size="sm" onClick={() => appendSeason({...getDefaultSeasonValue(), season_number: seasonFields.length + 1 })} className="text-gray-300 border-gray-600 hover:bg-gray-700"><Plus className="w-4 h-4 mr-1" />Adicionar Temporada</Button></div>
              {seasonFields.map((seasonItem, seasonIndex) => {
                const { fields: episodeFields, append: appendEpisode, remove: removeEpisode } = useFieldArray({ control: form.control, name: `formSeasons.${seasonIndex}.episodes` });
                return (
                  <div key={seasonItem.id} className="space-y-3 p-3 border border-gray-700 rounded-md bg-gray-800/20">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <FormField control={form.control} name={`formSeasons.${seasonIndex}.season_number`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-white">Número da Temporada *</FormLabel><FormControl><Input {...field} type="number" min="1" placeholder="Ex: 1" onChange={(e) => field.onChange(parseInt(e.target.value, 10) || undefined)} className="bg-gray-700 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name={`formSeasons.${seasonIndex}.title`} render={({ field }) => (<FormItem className="flex-1"><FormLabel className="text-white">Título da Temporada</FormLabel><FormControl><Input {...field} placeholder="Ex: O Início" className="bg-gray-700 border-gray-600 text-white" /></FormControl><FormMessage /></FormItem>)} />
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeSeason(seasonIndex)} disabled={seasonFields.length === 1} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 mt-2 md:mt-7"><X className="w-4 h-4 mr-1 md:mr-0" /> <span className="md:hidden">Remover Temporada</span></Button>
                    </div>
                    <div className="ml-0 md:ml-4 mt-4 space-y-3 border-t border-gray-700 pt-3">
                      <div className="flex items-center justify-between mb-2"><h4 className="text-md font-semibold text-gray-200">Episódios</h4><Button type="button" variant="outline" size="xs" onClick={() => appendEpisode({...getDefaultEpisodeValue(), episode_number: episodeFields.length + 1})} className="text-gray-300 border-gray-600 hover:bg-gray-700 text-xs"><Plus className="w-3 h-3 mr-1" />Adicionar Episódio</Button></div>
                      {episodeFields.map((episodeItem, episodeIndex) => (
                        <div key={episodeItem.id} className="p-3 border border-gray-600 rounded-md space-y-3 bg-gray-700/40">
                          <div className="flex items-center justify-between"><h5 className="text-sm font-semibold text-gray-300">Episódio {form.getValues(`formSeasons.${seasonIndex}.episodes.${episodeIndex}.episode_number`)}</h5><Button type="button" variant="ghost" size="xs" onClick={() => removeEpisode(episodeIndex)} disabled={episodeFields.length === 1} className="text-red-500 hover:text-red-400 text-xs p-1"><X className="w-3 h-3 mr-1" /> <span className="hidden sm:inline">Remover</span></Button></div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FormField control={form.control} name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.episode_number`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-gray-400">Número do Episódio *</FormLabel><FormControl><Input {...field} type="number" min="1" onChange={(e) => field.onChange(parseInt(e.target.value,10) || undefined)} className="bg-gray-600 border-gray-500 text-white text-sm" /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
                            <FormField control={form.control} name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.title`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-gray-400">Título do Episódio *</FormLabel><FormControl><Input {...field} className="bg-gray-600 border-gray-500 text-white text-sm" /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
                          </div>
                          <FormField control={form.control} name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.video_url`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-gray-400">Vídeo do Episódio *</FormLabel><FormControl><ControlledVideoUpload value={field.value} onChange={field.onChange} className="h-auto w-full min-h-[80px] text-xs" /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
                          <FormField control={form.control} name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.synopsis`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-gray-400">Sinopse do Episódio</FormLabel><FormControl><Textarea {...field} rows={2} className="bg-gray-600 border-gray-500 text-white text-sm" /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FormField control={form.control} name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.poster_url`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-gray-400">Poster Episódio</FormLabel><FormControl><ControlledImageUpload value={field.value} onChange={field.onChange} className="h-32 w-full text-xs" /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
                            <FormField control={form.control} name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.backdrop_url`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-gray-400">Backdrop Episódio</FormLabel><FormControl><ControlledImageUpload value={field.value} onChange={field.onChange} className="h-32 w-full text-xs" /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
                          </div>
                          <FormField control={form.control} name={`formSeasons.${seasonIndex}.episodes.${episodeIndex}.duration_minutes`} render={({ field }) => (<FormItem><FormLabel className="text-xs text-gray-400">Duração (minutos)</FormLabel><FormControl><Input {...field} type="number" min="0" onChange={(e) => field.onChange(e.target.value === '' ? null : parseInt(e.target.value,10) || 0)} className="bg-gray-600 border-gray-500 text-white text-sm" /></FormControl><FormMessage className="text-xs" /></FormItem>)} />
                        </div>
                      ))}
                      {form.formState.errors.formSeasons?.[seasonIndex]?.episodes?.root?.message && (<p className="text-sm font-medium text-destructive">{form.formState.errors.formSeasons?.[seasonIndex]?.episodes?.root?.message}</p>)}
                      {form.formState.errors.formSeasons?.[seasonIndex]?.episodes && !form.formState.errors.formSeasons?.[seasonIndex]?.episodes?.root && (<p className="text-sm font-medium text-destructive">Verifique os erros nos campos dos episódios.</p>)}
                    </div>
                  </div>
                )
              })}
              {form.formState.errors.formSeasons?.root?.message && (<p className="text-sm font-medium text-destructive">{form.formState.errors.formSeasons.root.message}</p>)}
              {form.formState.errors.formSeasons && !form.formState.errors.formSeasons.root && (<p className="text-sm font-medium text-destructive">Verifique os erros nos campos das temporadas.</p>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFieldArrayInputs('Atores', 'actors', actors, setActors)}
              {renderFieldArrayInputs('Diretores', 'directors', directors, setDirectors)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderFieldArrayInputs('Produtores', 'producers', producers, setProducers)}
              {renderFieldArrayInputs('Categorias', 'categories', categories, setCategories)}
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white">
              {loading ? 'Adicionando...' : 'Adicionar Série'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TVShowUpload;

[end of src/components/admin/TVShowUpload.tsx]
