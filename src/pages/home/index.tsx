import React from 'react';
import { TrendingMovies } from '../../components/TrendingMovies';
import './Home.css';

export const Home: React.FC = () => {
  return (
    <div className="home-container">
      <TrendingMovies />
    </div>
  );
};
