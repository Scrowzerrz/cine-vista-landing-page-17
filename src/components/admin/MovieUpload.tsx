
import React, { useState } from 'react';
import { Upload, Film, Plus, X } from 'lucide-react';
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

const movieSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  originalTitle: z.string().optional(),
  year: z.string().min(4, 'Ano deve ter 4 dígitos'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  rating: z.string().min(1, 'Classificação é obrigatória'),
  quality: z.string().min(1, 'Qualidade é obrigatória'),
  plot: z.string().min(10, 'Sinopse deve ter pelo menos 10 caracteres'),
  poster: z.string().url('URL do poster inválida'),
  backdrop: z.string().url('URL do backdrop inválida'),
  playerUrl: z.string().url('URL do player inválida'),
  actors: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  producers: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

const MovieUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [actors, setActors] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);

  const form = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: '',
      originalTitle: '',
      year: new Date().getFullYear().toString(),
      duration: '',
      rating: '',
      quality: 'HD',
      plot: '',
      poster: '',
      backdrop: '',
      playerUrl: '',
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

  const onSubmit = async (data: MovieFormData) => {
    setLoading(true);
    try {
      // Insert movie
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .insert({
          title: data.title,
          original_title: data.originalTitle || null,
          year: data.year,
          duration: data.duration,
          rating: data.rating,
          quality: data.quality,
          plot: data.plot,
          poster: data.poster,
          backdrop: data.backdrop,
          player_url: data.playerUrl,
        })
        .select()
        .single();

      if (movieError) {
        console.error('Supabase movie insert error:', movieError);
        throw new Error(`Falha ao inserir dados principais do filme: ${movieError.message}`);
      }

      const movieId = movieData.id;

      // Insert actors
      if (actors.some(actor => actor.trim())) {
        const actorNames = actors.filter(actor => actor.trim());
        try {
          for (const actorName of actorNames) {
            const { data: actorData, error: actorError } = await supabase
              .from('actors')
              .upsert({ name: actorName.trim() }, { onConflict: 'name' })
              .select()
              .single();

            if (actorError) throw actorError; // caught by current try-catch
            if (actorData) {
              const { error: movieActorError } = await supabase
                .from('movie_actors')
                .insert({ movie_id: movieId, actor_id: actorData.id });
              if (movieActorError) throw movieActorError; // caught by current try-catch
            }
          }
        } catch (error) {
          console.error('Error inserting actors:', error);
          throw new Error(`Falha ao adicionar atores: ${(error as Error).message}`);
        }
      }

      // Insert directors
      if (directors.some(director => director.trim())) {
        const directorNames = directors.filter(director => director.trim());
        try {
          for (const directorName of directorNames) {
            const { data: directorData, error: directorError } = await supabase
              .from('directors')
              .upsert({ name: directorName.trim() }, { onConflict: 'name' })
              .select()
              .single();

            if (directorError) throw directorError;
            if (directorData) {
              const { error: movieDirectorError } = await supabase
                .from('movie_directors')
                .insert({ movie_id: movieId, director_id: directorData.id });
              if (movieDirectorError) throw movieDirectorError;
            }
          }
        } catch (error) {
          console.error('Error inserting directors:', error);
          throw new Error(`Falha ao adicionar diretores: ${(error as Error).message}`);
        }
      }

      // Insert producers
      if (producers.some(producer => producer.trim())) {
        const producerNames = producers.filter(producer => producer.trim());
        try {
          for (const producerName of producerNames) {
            const { data: producerData, error: producerError } = await supabase
              .from('producers')
              .upsert({ name: producerName.trim() }, { onConflict: 'name' })
              .select()
              .single();

            if (producerError) throw producerError;
            if (producerData) {
              const { error: movieProducerError } = await supabase
                .from('movie_producers')
                .insert({ movie_id: movieId, producer_id: producerData.id });
              if (movieProducerError) throw movieProducerError;
            }
          }
        } catch (error) {
          console.error('Error inserting producers:', error);
          throw new Error(`Falha ao adicionar produtores: ${(error as Error).message}`);
        }
      }

      // Insert categories
      if (categories.some(category => category.trim())) {
        const categoryNames = categories.filter(category => category.trim());
        try {
          for (const categoryName of categoryNames) {
            const { data: categoryData, error: categoryError } = await supabase
              .from('categories')
              .upsert({ name: categoryName.trim() }, { onConflict: 'name' })
              .select()
              .single();

            if (categoryError) throw categoryError;
            if (categoryData) {
              const { error: movieCategoryError } = await supabase
                .from('movie_categories')
                .insert({ movie_id: movieId, category_id: categoryData.id });
              if (movieCategoryError) throw movieCategoryError;
            }
          }
        } catch (error) {
          console.error('Error inserting categories:', error);
          throw new Error(`Falha ao adicionar categorias: ${(error as Error).message}`);
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Filme adicionado com sucesso!',
      });

      // Reset form only on full success
      form.reset();
      setActors(['']);
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);

    } catch (error) {
      console.error('Error uploading movie:', error);
      const errorMessage = (error instanceof Error) ? error.message : 'Erro desconhecido ao adicionar filme.';
      toast({
        title: 'Erro ao Salvar Filme',
        description: `Falha na operação: ${errorMessage}`,
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
          <Film className="w-5 h-5" />
          Adicionar Filme
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
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Duração *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex: 120 min" className="bg-gray-800 border-gray-600 text-white" />
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

            <FormField
              control={form.control}
              name="playerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">URL do Player *</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" className="bg-gray-800 border-gray-600 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              {loading ? 'Adicionando...' : 'Adicionar Filme'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MovieUpload;
