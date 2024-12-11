import React from 'react';
import { Header } from '../Header';
import { Outlet } from 'react-router-dom';
import '../../App.css';

export const Layout: React.FC = () => {
  return (
    <div className="responsive-container">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
