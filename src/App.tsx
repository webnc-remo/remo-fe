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
          <Route element={<Layout />}>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<MovieSearchPage />} />
            <Route path="/movie/:movieId" element={<MovieDetailPage />} />
            {/* private routes */}
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/profile" element={<div>Profile</div>} />
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
