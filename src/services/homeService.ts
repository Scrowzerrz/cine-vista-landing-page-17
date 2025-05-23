
import { supabase } from '@/integrations/supabase/client';
import { Movie } from '@/types/movie';
import { MovieCardProps } from '@/types/movie';

export async function getHomePageMovies(): Promise<MovieCardProps[]> {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) {
    console.error('Error fetching home page movies:', error);
    return [];
  }
  
  return (data as Movie[]).map(movie => ({
    id: movie.id,
    title: movie.title,
    year: movie.year,
    duration: movie.duration,
    image: movie.poster,
    quality: movie.quality,
    type: 'DUB', // Fixo por enquanto, poderia vir do banco em uma implementação futura
    contentType: 'movie'
  }));
}
