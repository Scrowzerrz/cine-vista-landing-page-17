
// Representa um único episódio
export interface Episode {
  id: string; // uuid
  season_id: string; // uuid, FK to Season
  episode_number: number;
  title: string;
  overview?: string;
  video_url: string; // URL do vídeo
  runtime?: string;
  poster?: string; // Thumbnail/poster do episódio
  player_url?: string; // URL do player
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Representa uma temporada de uma série, contendo múltiplos episódios
export interface Season {
  id: string; // uuid
  tvshow_id: string; // uuid, FK to TVShow
  season_number: number;
  year: string;
  episode_count?: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  episodes?: Episode[]; // Array de episódios, pode ser carregado sob demanda
}

// Representa uma Série de TV (TV Show), contendo múltiplas temporadas
export interface TVShow {
  id: string; // uuid
  title: string;
  original_title?: string;
  year: string;
  rating: string;
  quality: string;
  plot?: string;
  poster?: string; // Poster principal da série
  backdrop?: string; // Backdrop principal da série
  network?: string;
  creator?: string;
  total_seasons: number;
  total_episodes: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  seasons?: Season[]; // Array de temporadas, pode ser carregado sob demanda
}

// Props para um card de TVShow, similar ao MovieCardProps
export interface TVShowCardProps {
  id: string;
  title: string;
  year?: string; // Ou release_year como string
  image?: string; // Geralmente poster_url
  contentType?: 'movie' | 'tvshow';
}
