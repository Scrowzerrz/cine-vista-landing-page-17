
import { supabase } from '@/integrations/supabase/client';

export interface TVShow {
  id: string;
  title: string;
  original_title: string | null;
  year: string;
  rating: string;
  plot: string;
  poster: string;
  backdrop: string;
  quality: string;
  network: string | null;
  creator: string | null;
  total_seasons: number;
  total_episodes: number;
  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;
  tvshow_id: string;
  season_number: number;
  year: string;
  episode_count: number;
  created_at: string;
}

export interface Episode {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  overview: string;
  runtime: string;
  poster: string;
  player_url: string;
  created_at: string;
}

export interface TVShowWithRelations extends TVShow {
  categories: Array<{ name: string }>;
  actors: Array<{ name: string }>;
  directors: Array<{ name: string }>;
  producers: Array<{ name: string }>;
  seasons: Array<Season & { episodes: Episode[] }>;
}

export async function getHomepageTVShows() {
  const { data, error } = await supabase
    .from('tvshows')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching homepage TV shows:', error);
    return [];
  }
  
  return data?.map(tvshow => ({
    id: tvshow.id,
    title: tvshow.title,
    year: tvshow.year,
    duration: `${tvshow.total_seasons} Temporadas`,
    image: tvshow.poster,
    quality: tvshow.quality,
    type: 'DUB',
    contentType: 'tvshow' as const
  })) || [];
}

export async function getTVShowDetails(id: string): Promise<TVShowWithRelations | null> {
  console.log('Fetching TV show details for ID:', id);
  
  const { data: tvshow, error: tvshowError } = await supabase
    .from('tvshows')
    .select('*')
    .eq('id', id)
    .single();

  if (tvshowError || !tvshow) {
    console.error('Error fetching TV show:', tvshowError);
    return null;
  }

  console.log('TV show found:', tvshow);

  // Buscar categorias
  const { data: categories, error: categoriesError } = await supabase
    .from('tvshow_categories')
    .select('categories(name)')
    .eq('tvshow_id', id);

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError);
  }

  // Buscar atores
  const { data: actors, error: actorsError } = await supabase
    .from('tvshow_actors')
    .select('actors(name)')
    .eq('tvshow_id', id);

  if (actorsError) {
    console.error('Error fetching actors:', actorsError);
  }

  console.log('Raw actors data:', actors);

  // Buscar diretores
  const { data: directors, error: directorsError } = await supabase
    .from('tvshow_directors')
    .select('directors(name)')
    .eq('tvshow_id', id);

  if (directorsError) {
    console.error('Error fetching directors:', directorsError);
  }

  // Buscar produtores
  const { data: producers, error: producersError } = await supabase
    .from('tvshow_producers')
    .select('producers(name)')
    .eq('tvshow_id', id);

  if (producersError) {
    console.error('Error fetching producers:', producersError);
  }

  // Buscar temporadas com episódios
  const { data: seasons, error: seasonsError } = await supabase
    .from('seasons')
    .select(`
      *,
      episodes(*)
    `)
    .eq('tvshow_id', id)
    .order('season_number');

  if (seasonsError) {
    console.error('Error fetching seasons:', seasonsError);
  }

  // Processar os dados dos atores
  const processedActors = actors?.map(item => {
    const actor = item.actors as any;
    return { name: actor?.name || 'Nome não disponível' };
  }).filter(actor => actor.name !== 'Nome não disponível') || [];

  console.log('Processed actors:', processedActors);

  return {
    ...tvshow,
    categories: categories?.map(c => ({ name: (c.categories as any)?.name })).filter(c => c.name) || [],
    actors: processedActors,
    directors: directors?.map(d => ({ name: (d.directors as any)?.name })).filter(d => d.name) || [],
    producers: producers?.map(p => ({ name: (p.producers as any)?.name })).filter(p => p.name) || [],
    seasons: seasons?.map(season => ({
      ...season,
      episodes: (season.episodes as Episode[]) || []
    })) || []
  };
}

export async function getRelatedTVShows(tvshowId: string) {
  const { data, error } = await supabase
    .from('related_tvshows')
    .select(`
      related_tvshow_id,
      tvshows!related_tvshows_related_tvshow_id_fkey(*)
    `)
    .eq('tvshow_id', tvshowId);

  if (error) {
    console.error('Error fetching related TV shows:', error);
    return [];
  }

  return data?.map(item => {
    const tvshow = item.tvshows as any;
    return {
      id: tvshow.id,
      title: tvshow.title,
      year: tvshow.year,
      duration: `${tvshow.total_seasons} Temporadas`,
      image: tvshow.poster,
      quality: tvshow.quality,
      type: 'DUB'
    };
  }) || [];
}
