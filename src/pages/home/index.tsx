import React from 'react';
import { TrendingMovies } from '../../components/TrendingMovies';
import './Home.css';
import { PopularMovies } from '../../components/PopularMovies';
import { MovieTrailers } from '../../components/MovieTrailers';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <TrendingMovies />
      <div className="my-8">
        <hr className="border-gray-200 dark:border-gray-700" />
      </div>
      <MovieTrailers />
      <div className="my-8">
        <hr className="border-gray-200 dark:border-gray-700" />
      </div>
      <PopularMovies />
    </div>
  );
};
