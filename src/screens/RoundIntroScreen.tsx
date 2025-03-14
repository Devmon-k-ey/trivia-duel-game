import { useEffect } from 'react';
import { View, Text, SafeAreaView, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGame } from '../context/GameContext';

type RoundIntroScreenProps = {
    navigation: StackNavigationProp<any>;
};

const RoundIntroScreen: React.FC<RoundIntroScreenProps> = ({ navigation }) => {
    const { gameState } = useGame();
    const fadeAnim = new Animated.Value(0);

    // Determine the starting player based on the current round
    const startingPlayer = gameState.currentRound % 2 === 1 ? 1 : 2;

    // Get player color based on who starts
    const playerBgColor = startingPlayer === 1 ?
        'bg-blue-600' : 'bg-purple-600';

    const playerGradient = startingPlayer === 1 ?
        'from-blue-500 to-blue-800' : 'from-purple-500 to-purple-800';

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Navigate to the game screen after a delay
        const timer = setTimeout(() => {
            navigation.replace('PlayerTurn');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1">
            <View className={`flex-1 ${playerBgColor} bg-gradient-to-b ${playerGradient}`}>
                <Animated.View
                    className="flex-1 items-center justify-center p-6"
                    style={{ opacity: fadeAnim }}
                >
                    <View className="bg-white/20 rounded-xl px-8 py-6 items-center">
                        <Text className="text-4xl font-bold text-white mb-4">
                            Round {gameState.currentRound}
                        </Text>

                        <View className="border-t border-white/30 w-full my-4" />

                        <Text className="text-3xl font-bold text-white mt-2">
                            Player {startingPlayer} Starts
                        </Text>
                    </View>

                    <View className="absolute bottom-12 w-full items-center">
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
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

export default RoundIntroScreen; 