import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { Home } from './pages/home';
import MovieSearchPage from './pages/search';
import MovieDetailPage from './pages/movie';
import { PrivateRoute } from './components/PrivateRoute';
import { NotFound } from './pages/notfound';
import { Layout } from './components/layout';
import { Profile } from './pages/profile/Profile';
import PeopleDetailPage from './pages/people/detail/index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ConfigProvider>
          <Routes>
            <Route element={<Layout />}>
              {/* public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<MovieSearchPage />} />
              <Route path="/movie/:movieId" element={<MovieDetailPage />} />
              <Route path="/people/:peopleId" element={<PeopleDetailPage />} />
              {/* private routes */}
              <Route path="/" element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Route>
            {/* not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
