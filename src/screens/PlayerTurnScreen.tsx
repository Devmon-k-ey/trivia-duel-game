import { useEffect } from 'react';
import { View, Text, SafeAreaView, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGame } from '../context/GameContext';

type PlayerTurnScreenProps = {
    navigation: StackNavigationProp<any>;
};

const PlayerTurnScreen: React.FC<PlayerTurnScreenProps> = ({ navigation }) => {
    const { gameState } = useGame();
    const scaleAnim = new Animated.Value(0.8);

    useEffect(() => {
        // Animate the text scaling up
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();

        const timer = setTimeout(() => {
            navigation.replace('Game');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    // Get player color based on player number
    const playerBgColor = gameState.currentPlayer === 1 ?
        'bg-blue-600' : 'bg-purple-600';

    const playerGradient = gameState.currentPlayer === 1 ?
        'from-blue-500 to-blue-800' : 'from-purple-500 to-purple-800';

    return (
        <SafeAreaView className="flex-1">
            <View className={`flex-1 ${playerBgColor} bg-gradient-to-b ${playerGradient}`}>
                <View className="flex-1 items-center justify-center p-6">
                    <Animated.View
                        className="w-32 h-32 rounded-full bg-white/90 justify-center items-center mb-8 shadow-lg"
                        style={{ transform: [{ scale: scaleAnim }] }}
                    >
                        <Text className="text-6xl font-bold text-gray-800">
                            {gameState.currentPlayer}
                        </Text>
                    </Animated.View>

                    <Text className="text-3xl font-bold text-center text-white mb-2 drop-shadow">
                        Player {gameState.currentPlayer}'s Turn
                    </Text>

                    <Text className="text-xl text-center text-white/90 mb-10">
                        Get ready to answer your question!
                    </Text>

                    <View className="absolute bottom-12 w-full items-center">
                        <Text className="text-xl font-semibold text-white mb-4">
                            Round {gameState.currentRound}
                        </Text>

                        <View className="flex-row justify-around w-4/5 bg-white/20 rounded-xl p-3">
                            <View className="items-center px-5">
                                <Text className="text-white mb-1">Player 1</Text>
                                <Text className="text-2xl font-bold text-white">
                                    {gameState.player1Score}
                                </Text>
                            </View>

                            <View className="border-r border-white/30 mx-2" />

                            <View className="items-center px-5">
                                <Text className="text-white mb-1">Player 2</Text>
                                <Text className="text-2xl font-bold text-white">
                                    {gameState.player2Score}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PlayerTurnScreen; 