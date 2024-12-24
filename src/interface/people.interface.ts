export interface MovieMinimum {
  id: number;
  title: string;
  backdrop_path: string;
  character: string;
}

export interface PeopleMovie {
  cast: MovieMinimum[];
  crew: MovieMinimum[];
}

export interface People {
  tmdb_id: number;
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string;
  name: string;
  gender: number;
  profile_path: string;
  popularity: number;
  place_of_birth: string;
  movie_credits: PeopleMovie;
}
