import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppProvider from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/Common/Toast';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
