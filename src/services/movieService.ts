
import { supabase } from '@/integrations/supabase/client';
import { Movie, MovieWithRelations } from '@/types/movie';

export async function getAllMovies() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
  
  return data as Movie[];
}

export async function getMovieById(id: string): Promise<MovieWithRelations | null> {
  // Fetch the movie details
  const { data: movie, error: movieError } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (movieError || !movie) {
    console.error('Error fetching movie:', movieError);
    return null;
  }
  
  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('movie_categories')
    .select('categories(id, name)')
    .eq('movie_id', id);
  
  // Fetch directors
  const { data: directors, error: directorsError } = await supabase
    .from('movie_directors')
    .select('directors(id, name)')
    .eq('movie_id', id);
  
  // Fetch producers
  const { data: producers, error: producersError } = await supabase
    .from('movie_producers')
    .select('producers(id, name)')
    .eq('movie_id', id);
  
  // Fetch actors
  const { data: actors, error: actorsError } = await supabase
    .from('movie_actors')
    .select('actors(id, name)')
    .eq('movie_id', id);
  
  // Fetch related movies
  const { data: relatedMoviesRaw, error: relatedError } = await supabase
    .from('related_movies')
    .select('related_movie_id')
    .eq('movie_id', id);
  
  let related_movies: Movie[] = [];
  if (relatedMoviesRaw && relatedMoviesRaw.length > 0) {
    const relatedIds = relatedMoviesRaw.map(item => item.related_movie_id);
    const { data: relatedMovies } = await supabase
      .from('movies')
      .select('*')
      .in('id', relatedIds);
    
    if (relatedMovies) {
      related_movies = relatedMovies as Movie[];
    }
  }
  
  // Handle any errors
  if (categoriesError || directorsError || producersError || actorsError || relatedError) {
    console.error('Error fetching relations:', {
      categoriesError,
      directorsError,
      producersError,
      actorsError,
      relatedError
    });
  }
  
  // Format the results
  const formattedMovie: MovieWithRelations = {
    ...movie,
    categories: categories?.map(c => c.categories) || [],
    directors: directors?.map(d => d.directors) || [],
    producers: producers?.map(p => p.producers) || [],
    actors: actors?.map(a => a.actors) || [],
    related_movies: related_movies || []
  };
  
  return formattedMovie;
}
