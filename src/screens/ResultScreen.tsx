import FontAwesome from '@expo/vector-icons/FontAwesome';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, SafeAreaView } from 'react-native';
// import Ionicons from '@expo/vector-icons/Ionicons';

import Button from '../components/Button';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../navigation';

type ResultScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Result'>;
  route: RouteProp<RootStackParamList, 'Result'>;
};

const ResultScreen: React.FC<ResultScreenProps> = ({ navigation, route }) => {
  const { gameState } = useGame();
  const { answer, isCorrect, timeTaken, playerId } = route.params;

  const formatTime = (timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const milliseconds = Math.floor((timeMs % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };

  // Check if both players have answered in the current round
  const currentRoundIndex = gameState.currentRound - 1;
  const currentRound = gameState.rounds[currentRoundIndex];

  const bothPlayersAnswered =
    currentRound &&
    currentRound.player1Answer.answer !== null &&
    currentRound.player2Answer.answer !== null;

  // Determine next player based on round number and current player
  const isEvenRound = gameState.currentRound % 2 === 0;

  const handleContinue = () => {
    if (bothPlayersAnswered) {
      navigation.replace('RoundSummary');
      return;
    }

    if (!isEvenRound) {
      if (playerId === 1) {
        navigation.replace('PlayerTurn');
      } else {
        navigation.replace('PlayerTurn');
      }
    } else {
      if (playerId === 2) {
        navigation.replace('PlayerTurn');
      } else {
        navigation.replace('PlayerTurn');
      }
    }
  };

  // Get theme colors based on player
  const playerColor = playerId === 1 ? 'bg-blue-600' : 'bg-purple-600';
  const playerGradient =
    playerId === 1 ? 'from-blue-500 to-blue-700' : 'from-purple-500 to-purple-700';
  const playerLightBg = playerId === 1 ? 'bg-blue-50' : 'bg-purple-50';
  const playerBorderColor = playerId === 1 ? 'border-blue-200' : 'border-purple-200';
  const playerTextColor = playerId === 1 ? 'text-blue-700' : 'text-purple-700';
  const resultBg = isCorrect ? 'bg-green-500' : 'bg-red-500';
  const resultGradient = isCorrect ? 'from-green-500 to-green-700' : 'from-red-500 to-red-700';
  const resultLightBg = isCorrect ? 'bg-green-50' : 'bg-red-50';
  const resultBorder = isCorrect ? 'border-green-200' : 'border-red-200';
  const resultText = isCorrect ? 'text-green-700' : 'text-red-700';

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View
        className={`${playerColor} bg-gradient-to-b ${playerGradient} rounded-b-[40px] pb-16 pt-6 shadow-lg`}>
        <View className="items-center">
          <View
            className={`${playerLightBg} mb-3 rounded-full border px-4 py-1.5 ${playerBorderColor}`}>
            <Text className={`${playerTextColor} text-base font-semibold`}>
              Player {playerId}'s Result
            </Text>
          </View>
          <Text className="mb-2 text-4xl font-bold text-white drop-shadow-sm">
            Round {gameState.currentRound}
          </Text>
        </View>
      </View>

      <View className={`mx-4 -mt-10 rounded-3xl border bg-white ${playerBorderColor} shadow-xl`}>
        <View
          className={`${resultBg} bg-gradient-to-b ${resultGradient} items-center rounded-t-3xl px-6 pb-10 pt-8`}>
          <View
            className={`${resultLightBg} mb-4 h-20 w-20 items-center justify-center rounded-full border-2 ${resultBorder}`}>
            <FontAwesome
              name={isCorrect ? 'check' : 'close'}
              size={40}
              color={isCorrect ? '#15803d' : '#dc2626'}
            />
          </View>
          <Text className="mb-1 text-3xl font-bold text-white">
            {isCorrect ? 'Correct!' : 'Incorrect!'}
          </Text>
          <Text className="text-lg font-medium text-white/90">
            {isCorrect ? 'Great job!' : 'Keep trying!'}
          </Text>
        </View>

        <View className="-mt-6 rounded-t-[32px] bg-white p-6">
          <View className="mb-6">
            <Text className="mb-2 text-center text-base font-medium text-gray-600">
              Your Answer
            </Text>
            <View className={`${playerLightBg} rounded-2xl border p-5 ${playerBorderColor}`}>
              <Text className={`${playerTextColor} text-center text-2xl font-bold`}>{answer}</Text>
            </View>
          </View>

          <View className="mb-8">
            <Text className="mb-2 text-center text-base font-medium text-gray-600">
              Response Time
            </Text>
            <View className={`${resultLightBg} rounded-2xl border p-5 ${resultBorder}`}>
              <Text className={`${resultText} text-center text-2xl font-bold`}>
                {formatTime(timeTaken)}
                <Text className={`${resultText} text-lg font-medium`}> seconds</Text>
              </Text>
            </View>
          </View>

          <Button
            title={bothPlayersAnswered ? 'See Round Results' : 'Continue'}
            onPress={handleContinue}
            variant={playerId === 1 ? 'primary' : 'secondary'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ResultScreen;
