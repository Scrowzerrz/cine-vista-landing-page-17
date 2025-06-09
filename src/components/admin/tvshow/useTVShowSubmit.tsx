
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TVShowFormData {
  title: string;
  originalTitle?: string;
  year: string;
  rating: string;
  quality: string;
  plot: string;
  poster: string;
  backdrop: string;
  totalSeasons: number;
  totalEpisodes: number;
  network?: string;
  creator?: string;
}

export const useTVShowSubmit = () => {
  const [loading, setLoading] = useState(false);

  const submitTVShow = async (
    data: TVShowFormData,
    actors: string[],
    directors: string[],
    producers: string[],
    categories: string[]
  ) => {
    setLoading(true);
    try {
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
          total_episodes: data.totalEpisodes,
          network: data.network || null,
          creator: data.creator || null,
        })
        .select()
        .single();

      if (tvshowError) throw tvshowError;

      const tvshowId = tvshowData.id;

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

      return true;
    } catch (error) {
      console.error('Error uploading tvshow:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar série. Tente novamente.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    submitTVShow,
  };
};
