import React, { useState } from 'react';
import Loading from './Loading';
import Home from './Home'; // Your actual Home component
import './App.css';

function App() {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div className="App">
      {showLoading ? (
        <Loading onLoadingComplete={handleLoadingComplete} />
      ) : (
        <Home/>
      )}
    </div>
  );
}

export default App;