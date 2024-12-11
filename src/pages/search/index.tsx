import React from 'react';
import { useLocation } from 'react-router-dom';
import { MovieSearch } from '../../components/MovieSearch';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const page = new URLSearchParams(location.search).get('page');

  return (
    <div>
      <MovieSearch initialQuery={query ?? ''} initialPage={page ? parseInt(page, 10) : 1} />
    </div>
  );
};

export default SearchPage;
