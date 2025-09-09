
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Button from './pages/Buttons';
import KingOfDiamonds from './components/KingOfDiamonds';
import Login from './components/Login';

function App() {
  const [gameState, setGameState] = useState('login'); // 'login' or 'playing'
  const [playerData, setPlayerData] = useState(null);

  const handleJoinGame = (data) => {
    setPlayerData(data);
    setGameState('playing');
  };

  const handleBackToLogin = () => {
    setGameState('login');
    setPlayerData(null);
  };

  return (
    <>
      <Navigation />
      {gameState === 'login' ? (
        <Login onJoinGame={handleJoinGame} />
      ) : (
        <KingOfDiamonds 
          playerData={playerData} 
          onBackToLogin={handleBackToLogin}
        />
      )}
    </>
  );
}


export default App
