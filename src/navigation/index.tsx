import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import RoundIntroScreen from '../screens/RoundIntroScreen';
import PlayerTurnScreen from '../screens/PlayerTurnScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import RoundSummaryScreen from '../screens/RoundSummaryScreen';
import GameOverScreen from '../screens/GameOverScreen';

export type RootStackParamList = {
  Home: undefined;
  RoundIntro: undefined;
  PlayerTurn: undefined;
  Game: undefined;
  Result: {
    answer: string;
    isCorrect: boolean;
    timeTaken: number;
    playerId: number;
  };
  RoundSummary: undefined;
  GameOver: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RoundIntro" component={RoundIntroScreen} />
        <Stack.Screen name="PlayerTurn" component={PlayerTurnScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="RoundSummary" component={RoundSummaryScreen} />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
