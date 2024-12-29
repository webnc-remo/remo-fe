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
import FavoriteMovies from './pages/lists/FavoriteMovies';
import WatchlistMovies from './pages/lists/WatchlistMovies';
import MovieLists from './pages/lists/MovieLists';
import ShareList from './pages/shareList';
import { RatingList } from './pages/ratings/RatingList';
import { VerifyEmail } from './pages/verify-email/index';
import { VerifyWrapper } from './components/VerifyWrapper';

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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

              <Route element={<VerifyWrapper />}>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<MovieSearchPage />} />
                <Route path="/movie/:movieId" element={<MovieDetailPage />} />
                <Route
                  path="/people/:peopleId"
                  element={<PeopleDetailPage />}
                />
                <Route path="/share/list/:id" element={<ShareList />} />

                <Route element={<PrivateRoute />}>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/favorites" element={<FavoriteMovies />} />
                  <Route path="/watchlist" element={<WatchlistMovies />} />
                  <Route path="/lists" element={<MovieLists />} />
                  <Route path="/ratings" element={<RatingList />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
