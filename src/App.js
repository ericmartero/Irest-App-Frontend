import React from 'react';
import { Navigation } from './routes';
import { AuthProvider } from './context';
import './App.scss';



function App() {
  return (
    <AuthProvider>
        <Navigation />
    </AuthProvider>
  );
}

export default App;
