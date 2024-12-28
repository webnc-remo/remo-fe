import React, { useState } from 'react';
import { Select, Button, Space, InputNumber } from 'antd';
import { useMovieGenres } from '../apis/movie/useMovieGenres';
import { SearchParam } from '../apis';
import { addSearchParamToUrl } from '../utils/search';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const MovieFilterBar: React.FC<{ query: SearchParam }> = ({ query }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    q: query.q,
    genre: query.genre,
    releaseYear: query.releaseYear,
    rating: query.rating,
  });
  const { genres } = useMovieGenres();
  const releaseYears = Array.from({ length: 10 }, (_, index) =>
    (new Date().getFullYear() - index).toString()
  );

  const handleChange = (key: string, value: string | number | null) => {
    const val = value ? value.toString() : value;
    setFilters((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleSearch = () => {
    const searchParam = [
      { key: 'query', value: filters.q },
      { key: 'genre', value: filters.genre },
      { key: 'year', value: filters.releaseYear },
      { key: 'rating', value: filters.rating },
    ];
    navigate(addSearchParamToUrl(searchParam), { replace: true });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        flexWrap: 'wrap',
        minWidth: '450px',
      }}
    >
      <Space size="small" wrap>
        {/* Genre */}
        <Select
          placeholder="Genre"
          style={{ width: 150 }}
          onChange={(value) => handleChange('genre', value)}
          value={filters.genre || undefined}
          allowClear
        >
          {genres?.length > 0 &&
            genres.map((genre) => (
              <Option key={genre.id} value={genre.name}>
                {genre.name}
              </Option>
            ))}
        </Select>

        {/* Release year */}
        <Select
          placeholder="Release Year"
          style={{ width: 100 }}
          onChange={(value) => handleChange('releaseYear', value)}
          allowClear
          value={filters.releaseYear || undefined}
        >
          {releaseYears?.length > 0 &&
            releaseYears.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
        </Select>

        <InputNumber<number>
          defaultValue={0}
          min={0}
          max={100}
          formatter={(value) => `${value}%`}
          parser={(value) => value?.replace('%', '') as unknown as number}
          onChange={(value) => handleChange('rating', value)}
          value={filters.rating}
        />

        {/* Nút Tìm kiếm */}
        <Button
          type="primary"
          style={{ backgroundColor: '#FF9800', border: 'none' }}
          onClick={handleSearch}
        >
          Tìm kiếm
        </Button>
      </Space>
    </div>
  );
};

export default MovieFilterBar;
