import { View, Text } from 'react-native';
import { RoundResult as RoundResultType } from '../types';

interface RoundResultProps {
  result: RoundResultType;
}

const RoundResult: React.FC<RoundResultProps> = ({ result }) => {
  const { player1Answer, player2Answer, winnerId } = result;
  
  const formatTime = (timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const milliseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };
  
  const getResultText = () => {
    if (winnerId === null) return "Round Tie!";
    return `Player ${winnerId} Wins Round!`;
  };
  
  return (
    <View className="bg-white rounded-xl shadow-md p-4 mb-4">
      <Text className="text-xl font-bold text-center mb-4">
        {getResultText()}
      </Text>
      
      <View className="flex-row mb-4">
        <View className="flex-1 border-r border-gray-200 pr-2">
          <Text className="text-lg font-bold text-center">Player 1</Text>
          <Text className="text-center">
            {player1Answer.isCorrect ? "✅ Correct" : "❌ Incorrect"}
          </Text>
          <Text className="text-center text-gray-600">
            Time: {formatTime(player1Answer.timeTaken)}
          </Text>
        </View>
        
        <View className="flex-1 pl-2">
          <Text className="text-lg font-bold text-center">Player 2</Text>
          <Text className="text-center">
            {player2Answer.isCorrect ? "✅ Correct" : "❌ Incorrect"}
          </Text>
          <Text className="text-center text-gray-600">
            Time: {formatTime(player2Answer.timeTaken)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RoundResult;