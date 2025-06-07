// src/types/tvshow.ts

// Representa um único episódio
export interface Episode {
  id: string; // uuid
  season_id: string; // uuid, FK to Season
  episode_number: number;
  title: string;
  synopsis?: string;
  video_url: string; // URL do vídeo
  duration_minutes?: number;
  poster_url?: string; // Thumbnail/poster do episódio
  backdrop_url?: string; // Imagem de fundo para a página do episódio (opcional)
  release_date?: string; // Formato YYYY-MM-DD
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

// Representa uma temporada de uma série, contendo múltiplos episódios
export interface Season {
  id: string; // uuid
  tv_show_id: string; // uuid, FK to TVShow
  season_number: number;
  title?: string; // Título opcional da temporada
  synopsis?: string;
  poster_url?: string; // Poster específico da temporada
  release_date?: string; // Formato YYYY-MM-DD
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  episodes?: Episode[]; // Array de episódios, pode ser carregado sob demanda
}

// Representa uma Série de TV (TV Show), contendo múltiplas temporadas
export interface TVShow {
  id: string; // uuid
  title: string;
  synopsis?: string;
  poster_url?: string; // Poster principal da série
  backdrop_url?: string; // Backdrop principal da série
  release_year?: number;
  genres?: string[]; // Array de strings para os gêneros
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  // Outros campos como rating, etc.
  seasons?: Season[]; // Array de temporadas, pode ser carregado sob demanda
}

// Props para um card de TVShow, similar ao MovieCardProps
export interface TVShowCardProps {
  id: string;
  title: string;
  year?: string; // Ou release_year como string
  image?: string; // Geralmente poster_url
  // Adicionar outros campos relevantes para um card, se necessário
  contentType?: 'movie' | 'tvshow';
}
