import { useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGame } from '../context/GameContext';
import { useFocusEffect } from '@react-navigation/native';

type HomeScreenProps = {
    navigation: StackNavigationProp<any>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { resetGame } = useGame();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useFocusEffect(
        useCallback(() => {
            // Reset game when returning to home screen
            resetGame();

            // Run entrance animation
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
                })
            ]).start();

            return () => {
                fadeAnim.setValue(0);
                slideAnim.setValue(50);
            };
        }, [])
    );

    const handleStartGame = () => {
        resetGame();
        navigation.navigate('RoundIntro');
    };
    
    return (
        <SafeAreaView className="flex-1 bg-green-600">
            <Animated.View
                className="flex-1 items-center justify-between p-6"
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}
            >
                <View className='flex flex-col flex-1 pt-40 items-center'>
                    <View className="bg-white/30 rounded-2xl h-40 w-40 flex items-center justify-center mb-10">
                        <View className='flex flex-row gap-4'>
                            <Text className="text-7xl text-white">+</Text>
                            <Text className="text-7xl text-white">−</Text>
                        </View>
                        <View className='flex flex-row gap-4'>
                            <Text className="text-7xl text-white">×</Text>
                            <Text className="text-7xl text-white">÷</Text>
                        </View>
                    </View>

                    <Text className="text-5xl font-bold text-white text-center mb-2" style={{ textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
                        Trivia Duel
                    </Text>

                    <Text className="text-xl text-white text-center mb-12" style={{ textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>
                        Test your knowledge against a friend!
                    </Text>
                </View>

                <View>
                    <View className="w-full mb-32">
                        <TouchableOpacity
                            className={`rounded-xl px-6 py-3 items-center justify-center shadow-md border border-white border-2 bg-green-500`}
                            onPress={handleStartGame}
                            activeOpacity={0.7}
                        >
                            <Text className="text-white font-bold text-2xl">
                                Start Game
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="absolute bottom-8 left-0 right-0 items-center">
                        <Text className="text-white text-center text-sm">
                            Version 1.0
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

export default HomeScreen; 