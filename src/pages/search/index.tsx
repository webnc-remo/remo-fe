import React from 'react';
import { useLocation } from 'react-router-dom';
import { MovieSearch } from '../../components/MovieSearch';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');

  return (
    <div>
      <MovieSearch initialQuery={query ?? ''} />
    </div>
  );
};

export default SearchPage;
