import { useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Image, TouchableOpacity, Animated } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';
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

    const handleInstructions = () => {
        navigation.navigate('Instructions');
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-700 to-purple-800">
            <Animated.View
                className="flex-1 items-center justify-center p-6"
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}
            >
                <View className="bg-white/30 rounded-full p-6 mb-8">
                    <Text className="text-7xl">🧠</Text>
                </View>

                <Text className="text-5xl font-bold text-white text-center mb-2" style={{ textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
                    Trivia Duel
                </Text>

                <Text className="text-xl text-white text-center mb-12" style={{ textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 }}>
                    Test your knowledge against a friend!
                </Text>

                <View className="w-full mb-4">
                    <Button
                        title="Start Game"
                        onPress={handleStartGame}
                        variant="success"
                    />
                </View>

                <TouchableOpacity
                    className="bg-white/30 rounded-xl py-3 px-6 mt-4"
                    onPress={handleInstructions}
                    activeOpacity={0.7}
                >
                    <Text className="text-white font-semibold text-center">How to Play</Text>
                </TouchableOpacity>

                <View className="absolute bottom-8 left-0 right-0 items-center">
                    <Text className="text-white text-center text-sm">
                        Version 1.0
                    </Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

export default HomeScreen; 