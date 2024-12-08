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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <Routes>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* private routes */}
          <Route path="/" element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<div>Profile</div>} />
              <Route path="/search" element={<MovieSearchPage />} />
              <Route path="/movie/:movieId" element={<MovieDetailPage />} />
            </Route>
          </Route>
          {/* not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
