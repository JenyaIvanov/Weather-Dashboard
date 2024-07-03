// src/App.tsx
import React from 'react';
import Weather from './components/Weather';

const App: React.FC = () => {
  return (
    <div className="h-screen p-1 bg-stone-800 text-white drop-shadow-lg">
      <Weather />
    </div>
  );
};

export default App;
