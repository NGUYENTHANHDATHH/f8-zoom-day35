import React, { useState, useEffect, useCallback } from 'react';
import styles from './KingOfDiamonds.module.scss';

const KingOfDiamonds = ({ playerData, onBackToLogin }) => {
  const [gameState, setGameState] = useState('setup'); // setup, playing, roundEnd, gameOver
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedNumbers, setSelectedNumbers] = useState({});
  const [roundResults, setRoundResults] = useState(null);
  const [eliminatedPlayers, setEliminatedPlayers] = useState(0);
  const [rules, setRules] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  // Initialize game
  const initializeGame = () => {
    const initialPlayers = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: i === 0 && playerData ? playerData.playerName : `Player ${i + 1}`,
      score: 0,
      isEliminated: false,
      isKing: i === 0, // First player is King of Diamonds
      isLocalPlayer: i === 0 && playerData
    }));
    
    setPlayers(initialPlayers);
    setGameState('playing');
    setCurrentRound(1);
    setTimeLeft(300); // 5 minutes for first round
    setEliminatedPlayers(0);
    setRules([]);
    setGameLog([
      `Game started! ${playerData ? playerData.playerName : 'Player 1'} enters the King of Diamonds game.`,
      playerData && playerData.gameRoom ? `Room Code: ${playerData.gameRoom}` : 'Waiting for other players...'
    ]);
  };

  // Add new rule when player is eliminated
  const addNewRule = (eliminatedCount) => {
    const newRules = [
      "If two or more players choose the same number, the number they choose becomes invalid, meaning they lose a point even if the number is closest to the average multiplied by 0.8.",
      "Choosing the exact correct number will cause other players to lose two points instead of one.",
      "If one player chooses 0, the other player can win by choosing 100."
    ];

    if (eliminatedCount <= 3 && newRules[eliminatedCount - 1]) {
      setRules(prev => [...prev, newRules[eliminatedCount - 1]]);
      setGameLog(prev => [...prev, `New rule added: ${newRules[eliminatedCount - 1]}`]);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endRound();
    }
  }, [gameState, timeLeft]);

  // Handle number selection
  const selectNumber = (playerId, number) => {
    if (gameState !== 'playing') return;
    
    setSelectedNumbers(prev => ({
      ...prev,
      [playerId]: number
    }));
  };

  // Calculate round results
  const calculateResults = () => {
    const activePlayers = players.filter(p => !p.isEliminated);
    const numbers = activePlayers.map(p => selectedNumbers[p.id]).filter(n => n !== undefined);
    
    if (numbers.length === 0) return null;

    const average = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const target = average * 0.8;
    
    // Check for duplicate numbers (Rule 1)
    const duplicates = {};
    numbers.forEach(num => {
      duplicates[num] = (duplicates[num] || 0) + 1;
    });
    
    const duplicateNumbers = Object.keys(duplicates).filter(num => duplicates[num] > 1);
    
    // Check for 0/100 rule (Rule 3)
    const hasZero = numbers.includes(0);
    const hasHundred = numbers.includes(100);
    
    let results = activePlayers.map(player => {
      const playerNumber = selectedNumbers[player.id];
      if (playerNumber === undefined) return { ...player, pointsLost: 0, reason: 'No number selected' };
      
      let pointsLost = 1;
      let reason = 'Closest to target';
      
      // Rule 1: Duplicate numbers are invalid
      if (duplicateNumbers.includes(playerNumber.toString())) {
        pointsLost = 1;
        reason = 'Duplicate number (invalid)';
      }
      // Rule 3: 100 beats 0
      else if (hasZero && hasHundred && playerNumber === 0) {
        pointsLost = 1;
        reason = '0 beaten by 100';
      }
      else if (hasZero && hasHundred && playerNumber === 100) {
        pointsLost = 0;
        reason = '100 beats 0';
      }
      // Rule 2: Exact match causes others to lose 2 points
      else if (playerNumber === Math.round(target)) {
        pointsLost = 0;
        reason = 'Exact match';
      }
      else {
        // Find closest to target
        const distances = activePlayers.map(p => {
          const num = selectedNumbers[p.id];
          return num !== undefined ? Math.abs(num - target) : Infinity;
        });
        const minDistance = Math.min(...distances);
        const isClosest = Math.abs(playerNumber - target) === minDistance;
        
        if (!isClosest) {
          // Check if exact match exists (Rule 2)
          const hasExactMatch = activePlayers.some(p => selectedNumbers[p.id] === Math.round(target));
          pointsLost = hasExactMatch ? 2 : 1;
          reason = hasExactMatch ? 'Exact match penalty' : 'Not closest to target';
        } else {
          pointsLost = 0;
          reason = 'Closest to target';
        }
      }
      
      return { ...player, pointsLost, reason };
    });
    
    return { target: Math.round(target), results };
  };

  // End current round
  const endRound = () => {
    const roundResults = calculateResults();
    if (!roundResults) return;
    
    setRoundResults(roundResults);
    
    // Update player scores
    const updatedPlayers = players.map(player => {
      const result = roundResults.results.find(r => r.id === player.id);
      if (result) {
        const newScore = player.score - result.pointsLost;
        return { ...player, score: newScore, isEliminated: newScore <= -10 };
      }
      return player;
    });
    
    setPlayers(updatedPlayers);
    
    // Check for eliminations
    const newlyEliminated = updatedPlayers.filter(p => p.isEliminated && !players.find(op => op.id === p.id).isEliminated);
    const newEliminatedCount = updatedPlayers.filter(p => p.isEliminated).length;
    
    if (newlyEliminated.length > 0) {
      setEliminatedPlayers(newEliminatedCount);
      addNewRule(newEliminatedCount);
      setGameLog(prev => [...prev, `${newlyEliminated.map(p => p.name).join(', ')} eliminated!`]);
    }
    
    // Check game end conditions
    const activePlayers = updatedPlayers.filter(p => !p.isEliminated);
    if (activePlayers.length === 1) {
      setGameState('gameOver');
      setGameLog(prev => [...prev, `GAME CLEAR! ${activePlayers[0].name} wins!`]);
    } else if (activePlayers.length === 0) {
      setGameState('gameOver');
      setGameLog(prev => [...prev, 'GAME OVER! All players eliminated!']);
    } else {
      setGameState('roundEnd');
    }
  };

  // Start next round
  const startNextRound = () => {
    setCurrentRound(prev => prev + 1);
    setSelectedNumbers({});
    setRoundResults(null);
    setGameState('playing');
    
    // Set time based on round
    const isNewRuleRound = currentRound === 1 || eliminatedPlayers > 0;
    setTimeLeft(isNewRuleRound ? 300 : 60); // 5 minutes for new rule rounds, 1 minute otherwise
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles['king-of-diamonds']}>
      <div className={styles['game-header']}>
        <div className={styles['header-top']}>
          <h1>King of Diamonds</h1>
          {onBackToLogin && (
            <button onClick={onBackToLogin} className={styles['back-btn']}>
              ← Back to Login
            </button>
          )}
        </div>
        <div className={styles['game-info']}>
          <div className={styles['round-info']}>Round {currentRound}</div>
          <div className={styles['timer']}>Time: {formatTime(timeLeft)}</div>
          <div className={styles['eliminated']}>Eliminated: {eliminatedPlayers}/4</div>
          {playerData && playerData.gameRoom && (
            <div className={styles['room-info']}>Room: {playerData.gameRoom}</div>
          )}
        </div>
      </div>

      {gameState === 'setup' && (
        <div className={styles['setup-screen']}>
          <h2>Welcome to King of Diamonds</h2>
          <p>5 players will compete in a strategic number game where only one can survive.</p>
          <button onClick={initializeGame} className={styles['start-button']}>
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className={styles['game-board']}>
          <div className={styles['rules-panel']}>
            <h3>Current Rules:</h3>
            <ul>
              <li>Choose a number between 0-100</li>
              <li>Average × 0.8 = target number</li>
              <li>Closest to target wins, others lose points</li>
              {rules.map((rule, index) => (
                <li key={index} className={styles['new-rule']}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className={styles['players-grid']}>
            {players.map(player => (
              <div key={player.id} className={`${styles['player-card']} ${player.isEliminated ? styles['eliminated'] : ''} ${player.isKing ? styles['king'] : ''}`}>
                <div className={styles['player-header']}>
                  <h3>{player.name}</h3>
                  {player.isKing && <span className={styles['king-badge']}>👑</span>}
                  <div className={styles['score']}>Score: {player.score}</div>
                </div>
                
                {!player.isEliminated && (
                  <div className={styles['number-selector']}>
                    <div className={styles['selected-number']}>
                      {selectedNumbers[player.id] !== undefined ? selectedNumbers[player.id] : '?'}
                    </div>
                    <div className={styles['number-grid']}>
                      {Array.from({ length: 101 }, (_, i) => (
                        <button
                          key={i}
                          className={`${styles['number-btn']} ${selectedNumbers[player.id] === i ? styles['selected'] : ''}`}
                          onClick={() => selectNumber(player.id, i)}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {player.isEliminated && (
                  <div className={styles['eliminated-message']}>
                    <div className={styles['acid-effect']}>💧</div>
                    <p>ELIMINATED</p>
                    <p>Score: {player.score}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles['game-controls']}>
            <button onClick={endRound} className={styles['end-round-btn']}>
              End Round
            </button>
          </div>
        </div>
      )}

      {gameState === 'roundEnd' && roundResults && (
        <div className={styles['round-results']}>
          <h2>Round {currentRound} Results</h2>
          <div className={styles['target-number']}>
            Target Number: {roundResults.target}
          </div>
          <div className={styles['results-grid']}>
            {roundResults.results.map(result => (
              <div key={result.id} className={`${styles['result-card']} ${result.pointsLost === 0 ? styles['winner'] : styles['loser']}`}>
                <h3>{result.name}</h3>
                <div className={styles['result-details']}>
                  <div>Number: {selectedNumbers[result.id]}</div>
                  <div>Points Lost: {result.pointsLost}</div>
                  <div>Reason: {result.reason}</div>
                  <div>New Score: {result.score - result.pointsLost}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={startNextRound} className={styles['next-round-btn']}>
            Next Round
          </button>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className={styles['game-over']}>
          <h2>Game Over</h2>
          <div className={styles['final-scores']}>
            {players.map(player => (
              <div key={player.id} className={`${styles['final-score']} ${player.isEliminated ? styles['eliminated'] : styles['survivor']}`}>
                <h3>{player.name}</h3>
                <div>Final Score: {player.score}</div>
                <div>{player.isEliminated ? 'ELIMINATED' : 'SURVIVOR'}</div>
              </div>
            ))}
          </div>
          <button onClick={initializeGame} className={styles['restart-btn']}>
            Play Again
          </button>
        </div>
      )}

      <div className={styles['game-log']}>
        <h3>Game Log</h3>
        <div className={styles['log-entries']}>
          {gameLog.map((entry, index) => (
            <div key={index} className={styles['log-entry']}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KingOfDiamonds;
