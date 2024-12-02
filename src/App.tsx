import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Login } from './pages/login';
import { Register } from './pages/register';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
