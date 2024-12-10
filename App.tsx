import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigation } from './src/navigation/AppNavigation';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
};

export default App;

