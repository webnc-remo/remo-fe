export interface Movie {
  id: number;
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
}
