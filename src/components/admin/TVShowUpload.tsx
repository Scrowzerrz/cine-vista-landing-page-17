
import React, { useState } from 'react';
import { Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TVShowBasicFields from './tvshow/TVShowBasicFields';
import TVShowPersonnelFields from './tvshow/TVShowPersonnelFields';
import SeasonManager from './tvshow/SeasonManager';
import { Season } from '@/hooks/useSeasonEpisodeManager';

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
});

type TVShowFormData = z.infer<typeof tvshowSchema>;

const TVShowUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [actors, setActors] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);
  const [seasons, setSeasons] = useState<Season[]>([]);

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
    }
  });

  const onSubmit = async (data: TVShowFormData) => {
    if (seasons.length === 0) {
      toast({
        title: 'Erro',
        description: 'Adicione pelo menos uma temporada com episódios.',
        variant: 'destructive',
      });
      return;
    }

    // Validate that all seasons have episodes with required data
    const invalidSeasons = seasons.filter(season => 
      season.episodes.some(ep => !ep.title || !ep.playerUrl)
    );

    if (invalidSeasons.length > 0) {
      toast({
        title: 'Erro',
        description: 'Todos os episódios devem ter título e URL do player.',
        variant: 'destructive',
      });
      return;
    }

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
          total_seasons: seasons.length,
          total_episodes: seasons.reduce((total, season) => total + season.episodeCount, 0),
          network: data.network || null,
          creator: data.creator || null,
        })
        .select()
        .single();

      if (tvshowError) throw tvshowError;

      const tvshowId = tvshowData.id;

      // Insert seasons and episodes
      for (const season of seasons) {
        const { data: seasonData, error: seasonError } = await supabase
          .from('seasons')
          .insert({
            tvshow_id: tvshowId,
            season_number: season.seasonNumber,
            episode_count: season.episodeCount,
            year: season.year,
          })
          .select()
          .single();

        if (seasonError) throw seasonError;

        // Insert episodes for this season
        for (const episode of season.episodes) {
          const { error: episodeError } = await supabase
            .from('episodes')
            .insert({
              season_id: seasonData.id,
              episode_number: episode.episodeNumber,
              title: episode.title,
              overview: episode.overview,
              runtime: episode.runtime,
              poster: episode.poster,
              player_url: episode.playerUrl,
            });

          if (episodeError) throw episodeError;
        }
      }

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
        description: `Série adicionada com ${seasons.length} temporadas e ${seasons.reduce((total, season) => total + season.episodeCount, 0)} episódios!`,
      });

      // Reset form
      form.reset();
      setActors(['']);
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);
      setSeasons([]);

    } catch (error) {
      console.error('Error uploading tvshow:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao adicionar série. Tente novamente.',
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
          <Tv className="w-5 h-5" />
          Adicionar Série Completa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TVShowBasicFields form={form} />
            
            <SeasonManager onSeasonsChange={setSeasons} />
            
            <TVShowPersonnelFields
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
                disabled={loading || seasons.length === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {loading ? 'Adicionando Série...' : `Adicionar Série (${seasons.length} temporadas, ${seasons.reduce((total, season) => total + season.episodeCount, 0)} episódios)`}
              </Button>
              
              {seasons.length === 0 && (
                <p className="text-center text-gray-400 text-sm mt-2">
                  Adicione pelo menos uma temporada para continuar
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TVShowUpload;
