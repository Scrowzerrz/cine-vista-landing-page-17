
import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MovieBasicFields from './movie/MovieBasicFields';
import MovieMediaFields from './movie/MovieMediaFields';
import MoviePersonnelFields from './movie/MoviePersonnelFields';
import MoviePlayerManager from './movie/MoviePlayerManager';

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

      if (movieError) throw movieError;

      const movieId = movieData.id;

      // Insert related data
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
              .from('movie_actors')
              .insert({ movie_id: movieId, actor_id: actorData.id });
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
              .from('movie_directors')
              .insert({ movie_id: movieId, director_id: directorData.id });
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
              .from('movie_producers')
              .insert({ movie_id: movieId, producer_id: producerData.id });
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
              .from('movie_categories')
              .insert({ movie_id: movieId, category_id: categoryData.id });
          }
        }
      }

      toast({
        title: 'Sucesso!',
        description: 'Filme adicionado com sucesso!',
      });

      // Reset form
      form.reset();
      setActors(['']);
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);

    } catch (error) {
      console.error('Error uploading movie:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar filme. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Film className="w-5 h-5" />
          Adicionar Filme Completo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <MovieBasicFields form={form} />
            
            <MovieMediaFields form={form} />
            
            <MoviePlayerManager
              playerUrl={form.watch('playerUrl')}
              onPlayerUrlChange={(url) => form.setValue('playerUrl', url)}
            />
            
            <MoviePersonnelFields
              actors={actors}
              directors={directors}
              producers={producers}
              categories={categories}
              setActors={setActors}
              setDirectors={setDirectors}
              setProducers={setProducers}
              setCategories={setCategories}
            />

            <div className="pt-4 border-t border-gray-700">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {loading ? 'Adicionando Filme...' : 'Adicionar Filme Completo'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MovieUpload;
