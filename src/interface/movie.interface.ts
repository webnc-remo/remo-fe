export interface Genre {
  id: number;
  name: string;
}

export interface MoviePeople {
  adult: boolean;
  name: string;
  profile_path: string;
  character: string;
  credit_id: string;
  id: number;
}

export interface Trailers {
  name: string;
  key: string;
  site: string;
  offical: string;
  published_at: string;
}

export interface Movie {
  id: number;
  tmdb_id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  backdrop_path: string | null;
  original_language: string;
  video: boolean;
  genres?: Genre[];
  tagline?: string;
  credits?: {
    cast: MoviePeople[];
    crew: MoviePeople[];
  };
  trailers?: Trailers[];
}
