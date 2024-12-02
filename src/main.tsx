import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

import { ThemeConfigProvider } from './config/ThemeConfigProvider';
import './tailwind.css';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <ThemeConfigProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    ,
  </ThemeConfigProvider>
);
