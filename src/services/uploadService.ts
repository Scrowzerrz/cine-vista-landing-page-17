import { supabase } from '@/integrations/supabase/client';
import { TVShow, Season, Episode } from '@/types/tvshow';
import { Movie } from '@/types/movie'; // Adicionando importação do tipo Movie

export interface MediaUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_type: 'movie_poster' | 'movie_backdrop' | 'tvshow_poster' | 'tvshow_backdrop' | 'episode_poster';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export async function uploadFile(file: File, uploadType: MediaUpload['upload_type']) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${uploadType}_${Date.now()}.${fileExt}`;
    const filePath = `${uploadType}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media-uploads')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: dbData, error: dbError } = await supabase
      .from('media_uploads')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        upload_type: uploadType,
        status: 'pending',
        user_id: user.id
      })
      .select()
      .single();

    if (dbError) {
      await supabase.storage.from('media-uploads').remove([filePath]);
      throw dbError;
    }

    return dbData as MediaUpload;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getAllUploads(): Promise<MediaUpload[]> {
  const { data, error } = await supabase
    .from('media_uploads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching uploads:', error);
    return [];
  }

  return (data || []) as MediaUpload[];
}

export async function updateUploadStatus(id: string, status: MediaUpload['status']) {
  const { data, error } = await supabase
    .from('media_uploads')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as MediaUpload;
}

export async function deleteUpload(id: string, filePath: string) {
  try {
    const { error: storageError } = await supabase.storage
      .from('media-uploads')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }

    const { error: dbError } = await supabase
      .from('media_uploads')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw dbError;
    }

    return true;
  } catch (error) {
    console.error('Error deleting upload:', error);
    throw error;
  }
}

export function getFileUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('media-uploads')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// --- Funções de TV Show ---
export async function saveTvShow(tvShowFormData: any): Promise<TVShow> {
  const dataToInsert = {
    title: tvShowFormData.title,
    original_title: tvShowFormData.originalTitle || null,
    release_year: parseInt(tvShowFormData.year, 10) || null,
    rating: tvShowFormData.rating || null,
    quality: tvShowFormData.quality || null,
    synopsis: tvShowFormData.plot,
    poster_url: tvShowFormData.poster,
    backdrop_url: tvShowFormData.backdrop,
    network: tvShowFormData.network || null,
    creator: tvShowFormData.creator || null,
  };

  Object.keys(dataToInsert).forEach(key => dataToInsert[key] === undefined && delete dataToInsert[key]);

  const { data, error } = await supabase
    .from('tvshows')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error saving TV show:', error.message, error.details);
    throw error;
  }
  return data as TVShow;
}

export async function saveSeason(seasonFormData: any, tvShowId: string): Promise<Season> {
  const dataToInsert = {
    tv_show_id: tvShowId,
    season_number: seasonFormData.season_number,
    title: seasonFormData.title || null,
  };

  Object.keys(dataToInsert).forEach(key => dataToInsert[key] === undefined && delete dataToInsert[key]);

  const { data, error } = await supabase
    .from('seasons')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error saving season:', error.message, error.details);
    throw error;
  }
  return data as Season;
}

export async function saveEpisode(episodeFormData: any, seasonId: string): Promise<Episode> {
  const dataToInsert = {
    season_id: seasonId,
    episode_number: episodeFormData.episode_number,
    title: episodeFormData.title,
    synopsis: episodeFormData.synopsis || null,
    video_url: episodeFormData.video_url,
    poster_url: episodeFormData.poster_url || null,
    backdrop_url: episodeFormData.backdrop_url || null,
    duration_minutes: episodeFormData.duration_minutes === '' ? null : episodeFormData.duration_minutes,
  };

  Object.keys(dataToInsert).forEach(key => dataToInsert[key] === undefined && delete dataToInsert[key]);
  if (dataToInsert.duration_minutes === '') {
    dataToInsert.duration_minutes = null;
  }

  const { data, error } = await supabase
    .from('episodes')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    console.error('Error saving episode:', error.message, error.details);
    throw error;
  }
  return data as Episode;
}

// --- Função para salvar Filme ---
export async function saveMovie(movieData: Partial<Movie>): Promise<Movie> {
  // Mapeie os campos do movieData para as colunas da tabela 'movies'
  // movieData vem do formulário (MovieFormData via MovieUpload.tsx)
  // Movie (type) campos: id, title, original_title, year, duration, rating, plot, poster, backdrop, quality, player_url
  // Supabase 'movies' table: title, original_title, year, duration, rating, plot, poster_url, backdrop_url, quality, player_url
  const dataToInsert = {
    title: movieData.title,
    original_title: movieData.original_title || null,
    year: movieData.year, // No formulário e no tipo Movie é string. Supabase deve ser string ou text.
    duration: movieData.duration,
    rating: movieData.rating,
    quality: movieData.quality,
    plot: movieData.plot,
    poster_url: movieData.poster, // 'poster' do form para 'poster_url' da tabela
    backdrop_url: movieData.backdrop, // 'backdrop' do form para 'backdrop_url' da tabela
    player_url: movieData.player_url,
  };

  // Remove chaves com valores undefined e converte strings vazias para null (exceto campos obrigatórios)
  Object.keys(dataToInsert).forEach(keyStr => {
    const key = keyStr as keyof typeof dataToInsert;
    if (dataToInsert[key] === undefined) {
      delete dataToInsert[key];
    }
    if (dataToInsert[key] === '') {
      // Lista de campos que são obrigatórios e não devem ser convertidos para null se string vazia
      // (assumindo que a validação Zod já garante que eles não estão vazios se forem obrigatórios)
      const nonNullableFields: (keyof typeof dataToInsert)[] = ['title', 'year', 'duration', 'rating', 'quality', 'plot', 'poster_url', 'backdrop_url', 'player_url'];
      if (!nonNullableFields.includes(key)) {
        (dataToInsert as any)[key] = null;
      }
    }
  });

  const { data, error } = await supabase
    .from('movies') // Nome da sua tabela de filmes
    .insert(dataToInsert as any) // Usar 'as any' se houver descasamento intencional de tipos (ex: string vs text)
    .select()
    .single();

  if (error) {
    console.error('Error saving movie:', error.message, error.details);
    throw error;
  }
  return data as Movie;
}
