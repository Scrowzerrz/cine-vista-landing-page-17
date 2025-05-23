
export interface Movie {
  id: string;
  title: string;
  original_title?: string;
  year: string;
  duration: string;
  rating: string;
  plot: string;
  poster: string;
  backdrop: string;
  quality: string;
  player_url: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Director {
  id: string;
  name: string;
}

export interface Producer {
  id: string;
  name: string;
}

export interface Actor {
  id: string;
  name: string;
}

export interface MovieWithRelations extends Movie {
  categories?: Category[];
  directors?: Director[];
  producers?: Producer[];
  actors?: Actor[];
  related_movies?: Movie[];
}

export interface MovieCardProps {
  id: string;
  title: string;
  year: string;
  duration: string;
  image: string;
  quality: string;
  type: string;
  contentType?: 'movie' | 'tvshow';
}
