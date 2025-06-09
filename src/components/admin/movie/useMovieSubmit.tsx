
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { saveMovie } from '@/services/uploadService';
import type { Movie } from '@/types/movie';
import type { MovieFormData } from '../MovieUpload';

export const useMovieSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submitMovie = async (
    formData: MovieFormData,
    actors: string[],
    directors: string[],
    producers: string[],
    categories: string[]
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const moviePayload: Partial<Movie> = {
        title: formData.title,
        original_title: formData.originalTitle,
        year: formData.year,
        duration: formData.duration,
        rating: formData.rating,
        quality: formData.quality,
        plot: formData.plot,
        poster: formData.poster as File | string | null,
        backdrop: formData.backdrop as File | string | null,
        player_url: formData.playerUrl as File | string | null,
      };

      const savedMovie = await saveMovie(moviePayload);

      if (!savedMovie || !savedMovie.id) {
        throw new Error("Falha ao salvar o filme ou obter seu ID.");
      }
      const movieId = savedMovie.id;

      // Handle actors
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

      // Handle directors
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

      // Handle producers
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

      // Handle categories
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

      return true;
    } catch (error) {
      console.error('Error uploading movie:', error);
      let errorMessage = 'Erro ao adicionar filme. Tente novamente.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        title: 'Erro no Envio',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, submitMovie };
};
