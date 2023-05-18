import React from 'react';
import { Navigation } from './routes';
import { AuthProvider } from './context';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './App.scss';

const stripeKey = loadStripe('pk_test_51N19O8LGn95IZX0nn5qvwmGAlgcPkKnSaB7ab8B1N30ukaIZGJGl2nIGbYFD5qLuN4OXs4c7zWPQ7Q046rIaWGEs0014objLCY');

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripeKey}>
        <Navigation />
      </Elements>
    </AuthProvider>
  );
}

export default App;
