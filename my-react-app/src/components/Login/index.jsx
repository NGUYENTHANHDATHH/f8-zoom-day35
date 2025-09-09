import React, { useState } from 'react';
import styles from './Login.module.scss';

const Login = ({ onJoinGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [gameRoom, setGameRoom] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [error, setError] = useState('');

  const handleJoinGame = (e) => {
    e.preventDefault();
    setError('');

    if (!playerName.trim()) {
      setError('Please enter your player name');
      return;
    }

    if (isJoiningRoom && !gameRoom.trim()) {
      setError('Please enter a game room code');
      return;
    }

    // Simulate joining game (in real app, this would connect to server)
    const gameData = {
      playerName: playerName.trim(),
      gameRoom: gameRoom.trim() || null,
      isCreatingRoom,
      playerId: Math.random().toString(36).substr(2, 9)
    };

    onJoinGame(gameData);
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substr(2, 6).toUpperCase();
    setGameRoom(code);
    setIsCreatingRoom(true);
    setIsJoiningRoom(false);
  };

  const toggleJoinMode = () => {
    setIsJoiningRoom(!isJoiningRoom);
    setIsCreatingRoom(false);
    setGameRoom('');
    setError('');
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['login-card']}>
        <div className={styles['login-header']}>
          <h1>King of Diamonds</h1>
          <p>Enter the deadly game where only one can survive</p>
        </div>

        <form onSubmit={handleJoinGame} className={styles['login-form']}>
          <div className={styles['form-group']}>
            <label htmlFor="playerName">Player Name</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              className={styles['form-input']}
            />
          </div>

          <div className={styles['game-mode-selection']}>
            <div className={styles['mode-options']}>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingRoom(true);
                  setIsJoiningRoom(false);
                  setGameRoom('');
                }}
                className={`${styles['mode-btn']} ${isCreatingRoom ? styles['active'] : ''}`}
              >
                Create New Game
              </button>
              <button
                type="button"
                onClick={toggleJoinMode}
                className={`${styles['mode-btn']} ${isJoiningRoom ? styles['active'] : ''}`}
              >
                Join Existing Game
              </button>
            </div>

            {isCreatingRoom && (
              <div className={styles['room-creation']}>
                <p>You will create a new game room</p>
                <button
                  type="button"
                  onClick={generateRoomCode}
                  className={styles['generate-code-btn']}
                >
                  Generate Room Code
                </button>
                {gameRoom && (
                  <div className={styles['room-code-display']}>
                    <label>Room Code:</label>
                    <div className={styles['room-code']}>{gameRoom}</div>
                    <small>Share this code with other players</small>
                  </div>
                )}
              </div>
            )}

            {isJoiningRoom && (
              <div className={styles['room-joining']}>
                <div className={styles['form-group']}>
                  <label htmlFor="gameRoom">Room Code</label>
                  <input
                    type="text"
                    id="gameRoom"
                    value={gameRoom}
                    onChange={(e) => setGameRoom(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    maxLength={6}
                    className={styles['form-input']}
                  />
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className={styles['error-message']}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles['join-game-btn']}
            disabled={!playerName.trim() || (isJoiningRoom && !gameRoom.trim())}
          >
            {isCreatingRoom ? 'Create & Join Game' : 'Join Game'}
          </button>
        </form>

        <div className={styles['game-info']}>
          <h3>Game Rules</h3>
          <ul>
            <li>5 players compete in strategic number selection</li>
            <li>Choose numbers 0-100, closest to average × 0.8 wins</li>
            <li>New rules unlock as players are eliminated</li>
            <li>Reach -10 points and face elimination</li>
            <li>Only one can survive!</li>
          </ul>
        </div>

        <div className={styles['warning']}>
          ⚠️ Warning: This is a deadly game. Enter at your own risk.
        </div>
      </div>
    </div>
  );
};

export default Login;
