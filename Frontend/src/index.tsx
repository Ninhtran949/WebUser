import './index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!); // Dấu ! để TypeScript biết chắc chắn element không null

root.render(<App />);
