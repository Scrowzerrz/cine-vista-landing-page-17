
import { supabase } from '@/integrations/supabase/client';
import { TVShow, Season, Episode } from '@/types/tvshow';
import { Movie } from '@/types/movie';

export type MediaUploadType =
  | 'movie_poster'
  | 'movie_backdrop'
  | 'tvshow_poster'
  | 'tvshow_backdrop'
  | 'episode_poster'
  | 'episode_backdrop'
  | 'movie_video'
  | 'episode_video';

export interface MediaUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_type: MediaUploadType;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export async function uploadFile(file: File, uploadType: MediaUploadType) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${uploadType}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${uploadType}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('media-uploads')
      .upload(filePath, file);
    if (uploadError) throw uploadError;
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
  if (error) { console.error('Error fetching uploads:', error); return []; }
  return (data || []) as MediaUpload[];
}

export async function updateUploadStatus(id: string, status: MediaUpload['status']) {
  const { data, error } = await supabase
    .from('media_uploads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as MediaUpload;
}

export async function deleteUpload(id: string, filePath: string) {
  try {
    const { error: storageError } = await supabase.storage.from('media-uploads').remove([filePath]);
    if (storageError) console.warn('Error deleting file from storage (may not be critical):', storageError);
    const { error: dbError } = await supabase.from('media_uploads').delete().eq('id', id);
    if (dbError) throw dbError;
    return true;
  } catch (error) {
    console.error('Error deleting upload:', error);
    throw error;
  }
}

export function getFileUrl(filePath: string): string {
  const { data } = supabase.storage.from('media-uploads').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function uploadImageAndGetUrl(file: File, uploadType: MediaUploadType): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated for image upload.');
  const fileExt = file.name.split('.').pop();
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const fileName = `${uploadType}_${user.id}_${Date.now()}_${randomSuffix}.${fileExt}`;
  const filePath = `${user.id}/${uploadType}/${fileName}`;
  const { error: uploadError } = await supabase.storage
    .from('media-uploads')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });
  if (uploadError) {
    console.error(`Error uploading ${uploadType} image:`, uploadError);
    throw new Error(`Failed to upload ${uploadType} image: ${uploadError.message}`);
  }
  const { data: publicUrlData } = supabase.storage.from('media-uploads').getPublicUrl(filePath);
  if (!publicUrlData || !publicUrlData.publicUrl) {
    console.error(`Failed to get public URL for ${filePath}`);
    throw new Error(`Failed to get public URL for ${filePath}`);
  }
  return publicUrlData.publicUrl;
}

export async function uploadVideoAndGetUrl(file: File, uploadType: 'movie_video' | 'episode_video'): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not authenticated for video upload.');
  }
  const fileExt = file.name.split('.').pop();
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const fileName = `${uploadType}_${user.id}_${Date.now()}_${randomSuffix}.${fileExt}`;
  const filePath = `${user.id}/${uploadType}/${fileName}`;
  const { error: uploadError } = await supabase.storage
    .from('media-uploads')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });
  if (uploadError) {
    console.error(`Error uploading ${uploadType} video:`, uploadError);
    throw new Error(`Failed to upload ${uploadType} video: ${uploadError.message}`);
  }
  const { data: publicUrlData } = supabase.storage
    .from('media-uploads')
    .getPublicUrl(filePath);
  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error(`Failed to get public URL for ${filePath}`);
  }
  return publicUrlData.publicUrl;
}

// --- Funções de TV Show ---
export async function saveTvShow(tvShowFormData: Partial<TVShow> & { 
  poster?: File | string; 
  backdrop?: File | string; 
  year?: string; 
  plot?: string;
  originalTitle?: string;
  rating?: string;
  quality?: string;
  network?: string;
  creator?: string;
  totalSeasons?: number;
  totalEpisodes?: number;
}): Promise<TVShow> {
  let posterUrlFromUpload: string | null = null;
  if (tvShowFormData.poster && typeof tvShowFormData.poster === 'object' && tvShowFormData.poster instanceof File) {
    posterUrlFromUpload = await uploadImageAndGetUrl(tvShowFormData.poster, 'tvshow_poster');
  } else if (typeof tvShowFormData.poster === 'string') {
    posterUrlFromUpload = tvShowFormData.poster;
  }

  let backdropUrlFromUpload: string | null = null;
  if (tvShowFormData.backdrop && typeof tvShowFormData.backdrop === 'object' && tvShowFormData.backdrop instanceof File) {
    backdropUrlFromUpload = await uploadImageAndGetUrl(tvShowFormData.backdrop, 'tvshow_backdrop');
  } else if (typeof tvShowFormData.backdrop === 'string') {
    backdropUrlFromUpload = tvShowFormData.backdrop;
  }

  const dataToInsert = {
    title: tvShowFormData.title,
    original_title: tvShowFormData.originalTitle || null,
    year: tvShowFormData.year || null,
    rating: tvShowFormData.rating || null,
    quality: tvShowFormData.quality || null,
    plot: tvShowFormData.plot || null,
    poster: posterUrlFromUpload,
    backdrop: backdropUrlFromUpload,
    network: tvShowFormData.network || null,
    creator: tvShowFormData.creator || null,
    total_seasons: tvShowFormData.totalSeasons || 1,
    total_episodes: tvShowFormData.totalEpisodes || 1,
  };

  Object.keys(dataToInsert).forEach(keyStr => {
    const key = keyStr as keyof typeof dataToInsert;
    if (dataToInsert[key] === undefined) delete dataToInsert[key];
  });

  const { data, error } = await supabase.from('tvshows').insert(dataToInsert as any).select().single();
  if (error) { 
    console.error('Error saving TV show:', error.message, error.details); 
    throw error; 
  }
  return {
    ...data,
    tvshow_id: data.id, // Map for interface compatibility
    updated_at: data.updated_at || new Date().toISOString()
  } as TVShow;
}

export async function saveSeason(seasonFormData: {
  season_number: number;
  year: string;
}, tvShowId: string): Promise<Season> {
  const dataToInsert = {
    tvshow_id: tvShowId,
    season_number: seasonFormData.season_number,
    year: seasonFormData.year,
  };

  const { data, error } = await supabase.from('seasons').insert(dataToInsert).select().single();
  if (error) { 
    console.error('Error saving season:', error.message, error.details); 
    throw error; 
  }
  return {
    ...data,
    updated_at: data.updated_at || new Date().toISOString()
  } as Season;
}

export async function saveEpisode(
  episodeFormData: {
    episode_number: number;
    title: string;
    overview: string;
    runtime: string;
    poster?: File | string | null;
    player_url?: File | string | null;
  },
  seasonId: string
): Promise<Episode> {

  let posterUrlFromUpload: string | null = null;
  if (episodeFormData.poster && typeof episodeFormData.poster === 'object' && episodeFormData.poster instanceof File) {
    posterUrlFromUpload = await uploadImageAndGetUrl(episodeFormData.poster, 'episode_poster');
  } else if (typeof episodeFormData.poster === 'string') {
    posterUrlFromUpload = episodeFormData.poster;
  }

  let videoUrlFromUpload: string | null = null;
  if (episodeFormData.player_url && typeof episodeFormData.player_url === 'object' && episodeFormData.player_url instanceof File) {
    videoUrlFromUpload = await uploadVideoAndGetUrl(episodeFormData.player_url, 'episode_video');
  } else if (typeof episodeFormData.player_url === 'string') {
    videoUrlFromUpload = episodeFormData.player_url;
  }

  const dataToInsert = {
    season_id: seasonId,
    episode_number: episodeFormData.episode_number,
    title: episodeFormData.title,
    overview: episodeFormData.overview,
    runtime: episodeFormData.runtime,
    poster: posterUrlFromUpload || '',
    player_url: videoUrlFromUpload || '',
  };

  const { data, error } = await supabase.from('episodes').insert(dataToInsert as any).select().single();
  if (error) { 
    console.error('Error saving episode:', error.message, error.details); 
    throw error; 
  }
  return {
    ...data,
    video_url: data.player_url, // Map for interface compatibility
    updated_at: data.updated_at || new Date().toISOString()
  } as Episode;
}

// --- Função para salvar Filme ---
export async function saveMovie(
  movieData: Partial<Movie> & {
    poster?: File | string | null;
    backdrop?: File | string | null;
    player_url?: File | string | null;
  }
): Promise<Movie> {

  let posterUrlFromUpload: string | null = null;
  if (movieData.poster && typeof movieData.poster === 'object' && movieData.poster instanceof File) {
    posterUrlFromUpload = await uploadImageAndGetUrl(movieData.poster, 'movie_poster');
  } else if (typeof movieData.poster === 'string') {
    posterUrlFromUpload = movieData.poster;
  }

  let backdropUrlFromUpload: string | null = null;
  if (movieData.backdrop && typeof movieData.backdrop === 'object' && movieData.backdrop instanceof File) {
    backdropUrlFromUpload = await uploadImageAndGetUrl(movieData.backdrop, 'movie_backdrop');
  } else if (typeof movieData.backdrop === 'string') {
    backdropUrlFromUpload = movieData.backdrop;
  }

  let videoUrlFromUpload: string | null = null;
  if (movieData.player_url && typeof movieData.player_url === 'object' && movieData.player_url instanceof File) {
    videoUrlFromUpload = await uploadVideoAndGetUrl(movieData.player_url, 'movie_video');
  } else if (typeof movieData.player_url === 'string') {
    videoUrlFromUpload = movieData.player_url;
  }

  const dataToInsert = {
    title: movieData.title,
    original_title: movieData.original_title || null,
    year: movieData.year,
    duration: movieData.duration,
    rating: movieData.rating,
    quality: movieData.quality,
    plot: movieData.plot,
    poster: posterUrlFromUpload || '',
    backdrop: backdropUrlFromUpload || '',
    player_url: videoUrlFromUpload || '',
  };

  const { data, error } = await supabase
    .from('movies')
    .insert(dataToInsert as any)
    .select()
    .single();
  if (error) { 
    console.error('Error saving movie:', error.message, error.details); 
    throw error; 
  }
  return data as Movie;
}
