import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Question, PlayerAnswer, RoundResult } from '../types';
import { questions } from '../data/questions';

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  submitAnswer: (playerId: number, answer: string, timeTaken: number) => void;
  nextRound: () => void;
  resetGame: () => void;
  getRandomQuestion: () => Question;
  registerTimer: (id: string, callback: (time: number) => void) => void;
  unregisterTimer: (id: string) => void;
  resetTimerStartTime: (id: string) => void;
}

const initialGameState: GameState = {
  currentRound: 1,
  currentPlayer: 1,
  player1Score: 0,
  player2Score: 0,
  rounds: [],
  currentQuestion: null,
  gameOver: false,
  winner: null
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  
  // Global timer state
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerCallbacks = useRef<Map<string, (time: number) => void>>(new Map());
  const timerStartTimes = useRef<Map<string, number>>(new Map());
  
  // Initialize the game with a random question
  useEffect(() => {
    if (!gameState.currentQuestion) {
      const randomQuestion = getRandomQuestion();
      setGameState(prevState => ({
        ...prevState,
        currentQuestion: randomQuestion
      }));
    }
    
    // Clean up the global timer on unmount
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, []);
  
  // Timer management functions
  const startGlobalTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    timerIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      
      // Update all registered timers
      timerCallbacks.current.forEach((callback, id) => {
        const startTime = timerStartTimes.current.get(id) || currentTime;
        const elapsedTime = currentTime - startTime;
        callback(elapsedTime);
      });
    }, 100); // Update more frequently for smoother UI
  }, []);
  
  const registerTimer = useCallback((id: string, callback: (time: number) => void) => {
    timerCallbacks.current.set(id, callback);
    timerStartTimes.current.set(id, Date.now());
    
    // Start the global timer if it's not already running
    if (!timerIntervalRef.current) {
      startGlobalTimer();
    }
  }, [startGlobalTimer]);
  
  const unregisterTimer = useCallback((id: string) => {
    timerCallbacks.current.delete(id);
    timerStartTimes.current.delete(id);
    
    // If no more timers, stop the global interval
    if (timerCallbacks.current.size === 0 && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);
  
  const resetTimerStartTime = useCallback((id: string) => {
    if (timerCallbacks.current.has(id)) {
      timerStartTimes.current.set(id, Date.now());
    }
  }, []);
  
  // Get a random question that hasn't been used in this game
  const getRandomQuestion = (): Question => {
    const usedQuestionIds = gameState.rounds.map(round => round.questionId);
    const availableQuestions = questions.filter(q => !usedQuestionIds.includes(q.id));
    
    // If we've used all questions, just use any
    if (availableQuestions.length === 0) {
      return questions[Math.floor(Math.random() * questions.length)];
    }
    
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  };
  
  const startGame = () => {
    const randomQuestion = getRandomQuestion();
    setGameState({
      ...initialGameState,
      currentQuestion: randomQuestion
    });
  };
  
  const submitAnswer = (playerId: number, answer: string, timeTaken: number) => {
    if (!gameState.currentQuestion) return;
    
    const isCorrect = answer === gameState.currentQuestion["Correct Answer"];
    const playerAnswer: PlayerAnswer = {
      playerId,
      answer,
      isCorrect,
      timeTaken
    };
    
    // Clone the current state to work with
    let updatedState = {...gameState};
    const currentRoundIndex = gameState.currentRound - 1;
    
    // Determine if this is the first or second player in the round
    const isFirstPlayerInRound = gameState.rounds.length <= currentRoundIndex || 
                               (!gameState.rounds[currentRoundIndex].player1Answer.answer && 
                                !gameState.rounds[currentRoundIndex].player2Answer.answer);
    
    const isPlayer1 = playerId === 1;
    const isPlayer2 = playerId === 2;
    
    // Handle updating the rounds array
    let updatedRounds = [...gameState.rounds];
    
    // If we don't have an entry for this round yet, create one
    if (updatedRounds.length <= currentRoundIndex) {
      updatedRounds.push({
        roundNumber: gameState.currentRound,
        questionId: gameState.currentQuestion.id,
        player1Answer: { playerId: 1, answer: null, isCorrect: false, timeTaken: 0 },
        player2Answer: { playerId: 2, answer: null, isCorrect: false, timeTaken: 0 },
        winnerId: null
      });
    }
    
    // Update the appropriate player's answer
    if (isPlayer1) {
      updatedRounds[currentRoundIndex].player1Answer = playerAnswer;
      console.log("Updated player 1's answer for round", gameState.currentRound);
    } else if (isPlayer2) {
      updatedRounds[currentRoundIndex].player2Answer = playerAnswer;
      console.log("Updated player 2's answer for round", gameState.currentRound);
    }
    
    // Check if both players have answered in this round
    const currentRound = updatedRounds[currentRoundIndex];
    const player1HasAnswered = currentRound.player1Answer.answer !== null;
    const player2HasAnswered = currentRound.player2Answer.answer !== null;
    const bothPlayersAnswered = player1HasAnswered && player2HasAnswered;
    
    // Update the state based on who just answered
    if (isPlayer1 && isFirstPlayerInRound && gameState.currentRound % 2 === 0) {
      // If player 1 answered first in an even round (unusual, but handle it)
      updatedState = {
        ...updatedState,
        currentPlayer: 2,
        rounds: updatedRounds
      };
      console.log("Player 1 went first (unusual in even round). Switching to player 2.");
    } else if (isPlayer1 && !isFirstPlayerInRound) {
      // Player 1 answered second
      // Determine winner and update scores
      const player1Answer = currentRound.player1Answer;
      const player2Answer = currentRound.player2Answer;
      
      let winnerId: number | null = determineRoundWinner(player1Answer, player2Answer);
      updatedRounds[currentRoundIndex].winnerId = winnerId;
      
      // Update scores
      let player1Score = updatedState.player1Score;
      let player2Score = updatedState.player2Score;
      
      if (winnerId === 1) player1Score++;
      if (winnerId === 2) player2Score++;
      
      // Check if game is over
      const gameOver = player1Score >= 3 || player2Score >= 3;
      const winner = player1Score >= 3 ? 1 : (player2Score >= 3 ? 2 : null);
      
      // Prepare for next round, starting with the appropriate player
      const nextRoundNumber = gameState.currentRound + 1;
      const nextRoundPlayer = nextRoundNumber % 2 === 1 ? 1 : 2;
      
      updatedState = {
        ...updatedState,
        player1Score,
        player2Score,
        rounds: updatedRounds,
        gameOver,
        winner,
        currentPlayer: nextRoundPlayer // Set up for next round
      };
      console.log("Player 1 finished second. Round complete.");
    } else if (isPlayer2 && isFirstPlayerInRound && gameState.currentRound % 2 === 1) {
      // If player 2 went first in an odd round (unusual, but handle it)
      updatedState = {
        ...updatedState,
        currentPlayer: 1,
        rounds: updatedRounds
      };
      console.log("Player 2 went first (unusual in odd round). Switching to player 1.");
    } else if (isPlayer2 && !isFirstPlayerInRound) {
      // Player 2 answered second
      // Determine winner and update scores
      const player1Answer = currentRound.player1Answer;
      const player2Answer = currentRound.player2Answer;
      
      let winnerId: number | null = determineRoundWinner(player1Answer, player2Answer);
      updatedRounds[currentRoundIndex].winnerId = winnerId;
      
      // Update scores
      let player1Score = updatedState.player1Score;
      let player2Score = updatedState.player2Score;
      
      if (winnerId === 1) player1Score++;
      if (winnerId === 2) player2Score++;
      
      // Check if game is over
      const gameOver = player1Score >= 3 || player2Score >= 3;
      const winner = player1Score >= 3 ? 1 : (player2Score >= 3 ? 2 : null);
      
      // Prepare for next round, starting with the appropriate player
      const nextRoundNumber = gameState.currentRound + 1;
      const nextRoundPlayer = nextRoundNumber % 2 === 1 ? 1 : 2;
      
      updatedState = {
        ...updatedState,
        player1Score,
        player2Score,
        rounds: updatedRounds,
        gameOver,
        winner,
        currentPlayer: nextRoundPlayer // Set up for next round
      };
      console.log("Player 2 finished second. Round complete.");
    } else {
      // First player in round finished (normal case)
      // Switch to the other player
      const nextPlayer = isPlayer1 ? 2 : 1;
      updatedState = {
        ...updatedState,
        currentPlayer: nextPlayer,
        rounds: updatedRounds
      };
      console.log(`${isPlayer1 ? 'Player 1' : 'Player 2'} finished first. Switching to ${nextPlayer}.`);
    }
    
    // Apply the state update
    setGameState(updatedState);
    console.log("Updated game state:", updatedState);
  };
  
  // Helper function to determine round winner
  const determineRoundWinner = (player1Answer: PlayerAnswer, player2Answer: PlayerAnswer): number | null => {
    if (player1Answer.isCorrect && !player2Answer.isCorrect) {
      return 1;
    } else if (!player1Answer.isCorrect && player2Answer.isCorrect) {
      return 2;
    } else if (player1Answer.isCorrect && player2Answer.isCorrect) {
      // Both correct, faster player wins
      return player1Answer.timeTaken < player2Answer.timeTaken ? 1 : 2;
    } else {
      // Both incorrect, it's a tie
      return null;
    }
  };
  
  const nextRound = () => {
    if (gameState.gameOver) return;
    
    const nextRoundNumber = gameState.currentRound + 1;
    const randomQuestion = getRandomQuestion();
    
    // Set starting player based on round number
    // Player 1 starts on odd-numbered rounds (1, 3, 5)
    // Player 2 starts on even-numbered rounds (2, 4, 6)
    const startingPlayer = nextRoundNumber % 2 === 1 ? 1 : 2;
    
    setGameState({
      ...gameState,
      currentRound: nextRoundNumber,
      currentPlayer: startingPlayer,
      currentQuestion: randomQuestion
    });
  };
  
  const resetGame = () => {
    const randomQuestion = getRandomQuestion();
    setGameState({
      ...initialGameState,
      currentQuestion: randomQuestion
    });
  };
  
  return (
    <GameContext.Provider value={{
      gameState,
      startGame,
      submitAnswer,
      nextRound,
      resetGame,
      getRandomQuestion,
      registerTimer,
      unregisterTimer,
      resetTimerStartTime
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};