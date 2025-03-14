import { useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';
import { useGame } from '../context/GameContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';


type RoundSummaryScreenProps = {
  navigation: StackNavigationProp<any>;
};

const RoundSummaryScreen: React.FC<RoundSummaryScreenProps> = ({ navigation }) => {
  const { gameState, nextRound } = useGame();
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Get the current round result safely
  const currentRoundIndex = gameState.currentRound - 1;
  const currentRoundResult = gameState.rounds[currentRoundIndex];
  
  // Safety check - if round data is missing, provide default values
  const safeRoundResult = currentRoundResult || {
    roundNumber: gameState.currentRound,
    questionId: gameState.currentQuestion?.id || '',
    player1Answer: { playerId: 1, answer: null, isCorrect: false, timeTaken: 0 },
    player2Answer: { playerId: 2, answer: null, isCorrect: false, timeTaken: 0 },
    winnerId: null
  };
  
  // Handle animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
    
    return () => {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    };
  }, []);
  
  const formatTime = (timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const milliseconds = Math.floor((timeMs % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };
  
  const handleContinue = () => {
    if (gameState.gameOver) {
      navigation.navigate('GameOver');
    } else {
      nextRound();
      navigation.navigate('RoundIntro');
    }
  };
  
  const player1Correct = safeRoundResult.player1Answer.isCorrect;
  const player2Correct = safeRoundResult.player2Answer.isCorrect;
  
  const getWinnerMessage = () => {
    if (safeRoundResult.winnerId === null) {
      return "It's a tie this round!";
    }
    
    const winnerTime = safeRoundResult.winnerId === 1 
      ? safeRoundResult.player1Answer.timeTaken 
      : safeRoundResult.player2Answer.timeTaken;
      
    return `Player ${safeRoundResult.winnerId} wins this round! (${formatTime(winnerTime)})`;
  };
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Animated.View 
        className="flex-1"
        style={{ 
          opacity: fadeAnim,
        }}
      >
        {/* Header */}
        <View className="bg-green-600 pt-6 pb-16 rounded-b-[40px] shadow-lg">
          <View className="items-center">
            <View className="bg-indigo-50 px-4 py-1.5 rounded-full mb-3 border border-indigo-200">
              <Text className="text-indigo-700 font-semibold text-base">
                Round {safeRoundResult.roundNumber} Results
              </Text>
            </View>
            <Text className="text-white text-4xl font-bold drop-shadow-sm mt-4 mb-2">
              {safeRoundResult.winnerId !== null
                ? `Player ${safeRoundResult.winnerId} Wins!`
                : "It's a Tie!"}
            </Text>
          </View>
        </View>

        {/* Results Cards */}
        <View className="flex-row px-4 -mt-10">
          {/* Player 1 Card */}
          <View className="flex-1 bg-white rounded-3xl shadow-lg border border-blue-100 mr-2">
            <View className="bg-gradient-to-b from-blue-500 to-blue-700 p-4 rounded-t-3xl items-center">
              <View className="bg-blue-50 rounded-full items-center justify-center mb-2 border-2 border-blue-200">
                <Text className="text-blue-700 text-xl font-bold px-4 py-2">Player 1</Text>
              </View>
            </View>
            
            <View className="p-4">
              <View className="items-center mb-3">
                <View className={`w-12 h-12 rounded-full items-center justify-center mb-1 ${player1Correct ? 'bg-green-100' : 'bg-red-100'}`}>
                  <FontAwesome 
                    name={player1Correct ? "check" : "close"} 
                    size={24} 
                    color={player1Correct ? "#15803d" : "#dc2626"}
                  />
                </View>
                <Text className={`font-medium ${player1Correct ? 'text-green-700' : 'text-red-700'}`}>
                  {player1Correct ? 'Correct' : 'Incorrect'}
                </Text>
              </View>
              
              <View className="bg-gray-50 rounded-xl p-3 mb-2">
                <Text className="text-gray-600 text-center text-sm mb-1">Answer</Text>
                <Text className="text-blue-700 text-center font-bold">
                  {safeRoundResult.player1Answer.answer || "None"}
                </Text>
              </View>
              
              <View className="bg-gray-50 rounded-xl p-3">
                <Text className="text-gray-600 text-center text-sm mb-1">Time</Text>
                <Text className="text-blue-700 text-center font-bold">
                  {formatTime(safeRoundResult.player1Answer.timeTaken)}
                </Text>
              </View>
            </View>
          </View>

          {/* Player 2 Card */}
          <View className="flex-1 bg-white rounded-3xl shadow-lg border border-purple-100 ml-2">
            <View className="bg-gradient-to-b from-purple-500 to-purple-700 p-4 rounded-t-3xl items-center">
              <View className="bg-purple-50 rounded-full items-center justify-center mb-2 border-2 border-purple-200">
                <Text className="text-purple-700 text-xl font-bold px-4 py-2">Player 2</Text>
              </View>
            </View>
            
            <View className="p-4">
              <View className="items-center mb-3">
                <View className={`w-12 h-12 rounded-full items-center justify-center mb-1 ${player2Correct ? 'bg-green-100' : 'bg-red-100'}`}>
                  <FontAwesome 
                    name={player2Correct ? "check" : "close"} 
                    size={24} 
                    color={player2Correct ? "#15803d" : "#dc2626"}
                  />
                </View>
                <Text className={`font-medium ${player2Correct ? 'text-green-700' : 'text-red-700'}`}>
                  {player2Correct ? 'Correct' : 'Incorrect'}
                </Text>
              </View>
              
              <View className="bg-gray-50 rounded-xl p-3 mb-2">
                <Text className="text-gray-600 text-center text-sm mb-1">Answer</Text>
                <Text className="text-purple-700 text-center font-bold">
                  {safeRoundResult.player2Answer.answer || "None"}
                </Text>
              </View>
              
              <View className="bg-gray-50 rounded-xl p-3">
                <Text className="text-gray-600 text-center text-sm mb-1">Time</Text>
                <Text className="text-purple-700 text-center font-bold">
                  {formatTime(safeRoundResult.player2Answer.timeTaken)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Updated Winner Message */}
        <View className="px-4 mt-4">
          <View className="bg-white rounded-2xl p-4 shadow border border-indigo-100">
            <Text className="text-gray-700 text-center font-medium text-lg">
              {getWinnerMessage()}
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View className="p-4 mt-auto">
          <Button 
            title={gameState.gameOver ? "See Final Results" : "Next Round"} 
            onPress={handleContinue} 
            variant={gameState.gameOver ? "primary" : "success"}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default RoundSummaryScreen; 