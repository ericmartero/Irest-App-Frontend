import React from 'react';
import { Navigation } from './routes';
import './App.scss';
import { AuthProvider } from './context';

function App() {
  return (
    <AuthProvider>
      <Navigation/>
    </AuthProvider>
  );
}

export default App;
