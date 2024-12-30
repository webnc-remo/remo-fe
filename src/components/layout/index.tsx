import React from 'react';
import { Header } from '../Header';
import { Outlet } from 'react-router-dom';
import '../../App.css';
import { Footer } from '../Footer';

export const Layout: React.FC = () => {
  return (
    <div className='layout-wrapper'>
      <div>
        <Header />
      </div>
      <main className="responsive-container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
