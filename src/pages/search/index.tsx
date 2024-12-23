import React from 'react';
import { useLocation } from 'react-router-dom';
import { MovieSearch } from '../../components/MovieSearch';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const page = new URLSearchParams(location.search).get('page');
  const take = new URLSearchParams(location.search).get('take');
  const order = new URLSearchParams(location.search).get('order');
  const validOrder = order === 'desc' || order === 'asc' ? order : 'asc';

  return (
    <div>
      <MovieSearch
        initialQuery={query ?? ''}
        initialPage={page ? parseInt(page, 10) : 1}
        initialPageSize={take ? parseInt(take, 10) : 12}
        initialOrder={validOrder}
      />
    </div>
  );
};

export default SearchPage;
