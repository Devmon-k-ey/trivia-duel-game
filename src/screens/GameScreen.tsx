import { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGame } from '../context/GameContext';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import Button from '../components/Button';

type GameScreenProps = {
  navigation: StackNavigationProp<any>;
};

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
  const { gameState, submitAnswer } = useGame();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const fadeAnim = new Animated.Value(0);
  
  // Reset the state when the component mounts or when the current player changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsTimerRunning(true);
    setTimeTaken(0);
    setIsAnswerSubmitted(false);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [gameState.currentPlayer]);
  
  const handleSelectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    // Don't stop the timer here anymore
  }, []);
  
  const handleTimeUpdate = useCallback((time: number) => {
    setTimeTaken(time);
  }, []);
  
  const handleConfirm = useCallback(() => {
    if (!selectedAnswer || !gameState.currentQuestion) return;
    
    // Stop the timer when confirming the answer
    setIsTimerRunning(false);
    
    const isCorrect = selectedAnswer === gameState.currentQuestion["Correct Answer"];
    setIsAnswerSubmitted(true);
    
    // Store the current player ID before it gets updated in context
    const currentPlayerId = gameState.currentPlayer;
    
    submitAnswer(gameState.currentPlayer, selectedAnswer, timeTaken);
    
    // Navigate to the result screen with explicit player ID
    navigation.navigate('Result', {
      answer: selectedAnswer,
      isCorrect,
      timeTaken,
      playerId: currentPlayerId
    });
  }, [selectedAnswer, gameState.currentQuestion, gameState.currentPlayer, timeTaken, submitAnswer, navigation]);
  
  // Get player color based on current player
  const headerBgColor = gameState.currentPlayer === 1 ? 
    'bg-blue-600' : 'bg-purple-600';
  
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className={`${headerBgColor} pt-10 pb-5 px-4 shadow-md rounded-b-[40px]`}>
        <View className="flex-row justify-between items-center">
          <View className="bg-white/20 rounded-full py-2 px-4">
            <Text className="text-white font-bold">
              Round {gameState.currentRound}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-white font-bold mr-2">
              Player {gameState.currentPlayer}
            </Text>
            
            <View className="bg-white rounded-full w-8 h-8 items-center justify-center">
              <Text className="font-bold text-gray-800">
                {gameState.currentPlayer === 1 ? gameState.player1Score : gameState.player2Score}
              </Text>
            </View>
          </View>
          
          {isTimerRunning ? (
            <Timer 
              isRunning={isTimerRunning} 
              onTimeUpdate={handleTimeUpdate}
              timerId={`player${gameState.currentPlayer}-round${gameState.currentRound}`}
            />
          ) : (
            <View className="bg-gray-600 rounded-full py-2 px-4">
              <Text className="text-white font-bold">
                {(timeTaken / 1000).toFixed(2)}s
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View className="flex-1 px-4 pt-4 pb-4">
        <View className="flex-1 mb-4">
          <QuestionCard 
            question={gameState.currentQuestion!}
            onSelectAnswer={handleSelectAnswer}
            disabled={isAnswerSubmitted}
            currentPlayer={gameState.currentPlayer}
          />
        </View>
        
        <Button 
          title="Confirm Answer" 
          onPress={handleConfirm}
          disabled={selectedAnswer === null || isAnswerSubmitted}
          variant={gameState.currentPlayer === 1 ? "primary" : "secondary"}
        />
      </View>
    </SafeAreaView>
  );
};

export default GameScreen;