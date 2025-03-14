import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal, Image, Animated, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Button from '../components/Button';
import { useGame } from '../context/GameContext';
import { questions } from '../data/questions';
import { explanations } from '../data/explanations';
import type { Question } from '../types';
import { useFocusEffect } from '@react-navigation/native';

type GameOverScreenProps = {
  navigation: StackNavigationProp<any>;
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({ navigation }) => {
  const { gameState, resetGame } = useGame();
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [currentExplanation, setCurrentExplanation] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(0);
  const hasAnimated = useRef(false);
  
  // For debugging
  useEffect(() => {
    // Log questions and explanations structure
    console.log("Questions available:", questions.length);
    console.log("Explanations available:", explanations.length);
    
    if (explanations.length > 0) {
      console.log("First explanation sample:", {
        questionId: explanations[0]["Question ID"],
        steps: [
          explanations[0]["Step 1 Name"],
          explanations[0]["Step 2 Name"],
          explanations[0]["Step 3 Name"]
        ]
      });
    }
  }, []);
  
  useFocusEffect(
    useCallback(() => {
      if (!hasAnimated.current) {
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start(() => {
          hasAnimated.current = true;
        });
      }
      
      return () => {
        hasAnimated.current = false;
        scaleAnim.setValue(0.5);
      };
    }, [])
  );
  
  const handlePlayAgain = () => {
    resetGame();
    navigation.navigate('Home');
  };
  
  const handleShowExplanation = (roundNumber: number) => {
    try {
      console.log(`Attempting to show explanation for round ${roundNumber}`);
      
      // Get round data
      const roundIndex = roundNumber - 1;
      if (roundIndex < 0 || roundIndex >= gameState.rounds.length) {
        console.error(`Invalid round index: ${roundIndex}`);
        Alert.alert("Error", "Could not find round data");
        return;
      }
      
      const round = gameState.rounds[roundIndex];
      console.log(`Found round data with question ID: ${round.questionId}`);
      
      // Get question data
      const question = questions.find(q => q.id === round.questionId);
      if (!question) {
        console.error(`Question not found for ID: ${round.questionId}`);
        Alert.alert("Error", "Question data not found");
        return;
      }
      
      // Find the explanation in the explanations array
      const explanation = explanations.find(e => e["Question ID"] === round.questionId);
      if (!explanation) {
        console.log(`No explanation found for question ID: ${round.questionId}`);
      } else {
        console.log(`Found explanation for question ID: ${round.questionId}`);
      }
      
      // Set the current question and explanation
      setCurrentQuestion(question);
      setCurrentExplanation(explanation);
      setCurrentRoundNumber(roundNumber);
      
      // Show the modal
      setShowExplanationModal(true);
      
    } catch (error) {
      console.error("Error in handleShowExplanation:", error);
      Alert.alert("Error", "Something went wrong showing the explanation.");
    }
  };
  
  const closeExplanationModal = () => {
    setShowExplanationModal(false);
  };
  
  const getQuestion = (id: string): Question | undefined => {
    return questions.find(q => q.id === id);
  };
  
  const winnerColor = gameState.winner === 1 ? 
    'bg-blue-600' : 'bg-purple-600';
  
  const winnerGradient = gameState.winner === 1 ?
    'from-blue-500 to-blue-700' : 'from-purple-500 to-purple-700';
  
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className={`${winnerColor} bg-gradient-to-b ${winnerGradient} pt-6 pb-8 rounded-b-[40px] shadow-lg`}>
        <Text className="text-white text-2xl font-bold text-center drop-shadow-md">
          Game Over!
        </Text>
        
        <Text className="text-white text-4xl font-semibold text-center mt-6 opacity-90">
          Player {gameState.winner} Wins!
        </Text>
        
        <View className="items-center mt-4">
          <Animated.View 
            style={{ 
              transform: [{ scale: scaleAnim }],
            }}
          >
            <View className="h-28 w-28 items-center justify-center bg-white/20 rounded-full shadow-lg">
              <Text className="text-white text-6xl">🏆</Text>
            </View>
          </Animated.View>
        </View>
        
        <View className="flex-row justify-center mt-4">
          <View className="bg-white/20 rounded-xl px-8 py-3 flex-row">
            <View className="items-center mr-8">
              <Text className="text-white font-semibold opacity-90">P1</Text>
              <Text className="text-white text-2xl font-bold">{gameState.player1Score}</Text>
            </View>

            <View className="border-r border-white/30 mx-2" />
            
            <View className="items-center ml-8">
              <Text className="text-white font-semibold opacity-90">P2</Text>
              <Text className="text-white text-2xl font-bold">{gameState.player2Score}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <Text className="text-gray-700 text-xl font-bold mb-4 mt-2">Round Results</Text>
        
        {gameState.rounds.map((round, index) => (
          <View key={index} className="bg-white mb-4 rounded-xl shadow-sm overflow-hidden">
            <View className="bg-gray-100 py-2 px-4 border-b border-gray-200">
              <Text className="font-bold text-gray-700">Round {round.roundNumber}</Text>
            </View>
            
            <View className="p-4">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View className="h-5 w-5 rounded-full bg-blue-500 items-center justify-center mr-2">
                      <Text className="text-white text-xs font-bold">1</Text>
                    </View>
                    <Text className="font-semibold text-blue-600">Player 1</Text>
                  </View>
                  
                  <View className="bg-blue-50 rounded-md p-3 mb-2">
                    <Text>{round.player1Answer.isCorrect ? '✅ Correct' : '❌ Wrong'}</Text>
                    <Text className="text-gray-600 text-sm">
                      Answer: {round.player1Answer.answer || "None"}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      Time: {(round.player1Answer.timeTaken / 1000).toFixed(2)}s
                    </Text>
                  </View>
                </View>
                
                <View className="w-6" />
                
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <View className="h-5 w-5 rounded-full bg-purple-500 items-center justify-center mr-2">
                      <Text className="text-white text-xs font-bold">2</Text>
                    </View>
                    <Text className="font-semibold text-purple-600">Player 2</Text>
                  </View>
                  
                  <View className="bg-purple-50 rounded-md p-3 mb-2">
                    <Text>{round.player2Answer.isCorrect ? '✅ Correct' : '❌ Wrong'}</Text>
                    <Text className="text-gray-600 text-sm">
                      Answer: {round.player2Answer.answer || "None"}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      Time: {(round.player2Answer.timeTaken / 1000).toFixed(2)}s
                    </Text>
                  </View>
                </View>
              </View>
              
              {round.winnerId !== null ? (
                <View className="bg-gray-100 rounded-md p-2 mt-1">
                  <Text className="text-center font-semibold">
                    Round Winner: Player {round.winnerId}
                  </Text>
                </View>
              ) : (
                <View className="bg-gray-100 rounded-md p-2 mt-1">
                  <Text className="text-center font-semibold">
                    Round Tied
                  </Text>
                </View>
              )}
              
              <View className="mt-2 pt-2 border-t border-gray-100">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-semibold flex-1">
                    Correct: {getQuestion(round.questionId)?.["Correct Answer"] || "?"}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={() => handleShowExplanation(round.roundNumber)}
                    className="bg-indigo-100 rounded-full px-3 py-1"
                  >
                    <Text className="text-indigo-700 font-medium">See Explanation</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View className="p-4 bg-white border-t border-gray-200">
        <Button 
          title="Play Again" 
          onPress={handlePlayAgain} 
          variant="success"
        />
      </View>
      
      {/* Step-by-Step Explanation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        visible={showExplanationModal}
        onRequestClose={closeExplanationModal}
      >
        <View className="flex-1 justify-center items-center bg-black/50 max-h-[100vh]">
          <View className="w-11/12 bg-white rounded-xl p-5 max-h-[80%]">
            <ScrollView>
              <Text className="text-xl font-bold text-center mb-4">
                Round {currentRoundNumber} Explanation
              </Text>
              
              <View className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="font-bold mb-1">Question:</Text>
                <Text className="text-gray-800 mb-3">
                  {currentQuestion?.Question || "Question not available"}
                </Text>
                
                <Text className="font-bold mb-1">Correct Answer:</Text>
                <View className="bg-green-100 p-2 rounded-md">
                  <Text className="text-green-800 font-medium">
                    {currentQuestion?.["Correct Answer"] || "?"}: {
                      currentQuestion?.[`${currentQuestion?.["Correct Answer"]}`] || 
                      "Answer text not available"
                    }
                  </Text>
                </View>
              </View>
              
              {currentExplanation ? (
                <View className="mb-4">
                  <Text className="text-lg font-bold mb-3">Step-by-Step Explanation:</Text>
                  
                  {/* Step 1 */}
                  {
                    currentExplanation["Step 1 Name"] && currentExplanation["Step 1 Description"] &&
                    <View className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-100">
                      <Text className="font-bold text-blue-800 mb-1">
                        {currentExplanation["Step 1 Name"] || "Step 1"}
                      </Text>
                      <Text className="text-gray-800">
                        {currentExplanation["Step 1 Description"] || "No description available"}
                      </Text>
                    </View>
                  }
                  
                  {/* Step 2 */}
                  {
                    currentExplanation["Step 2 Name"] && currentExplanation["Step 2 Description"] &&
                    <View className="bg-purple-50 p-3 rounded-lg mb-3 border border-purple-100">
                      <Text className="font-bold text-purple-800 mb-1">
                        {currentExplanation["Step 2 Name"] || "Step 2"}
                      </Text>
                      <Text className="text-gray-800">
                        {currentExplanation["Step 2 Description"] || "No description available"}
                      </Text>
                    </View>
                  }
                  
                  {/* Step 3 */}
                  {
                    currentExplanation["Step 3 Name"] && currentExplanation["Step 3 Description"] &&
                    <View className="bg-green-50 p-3 rounded-lg mb-3 border border-green-100">
                      <Text className="font-bold text-green-800 mb-1">
                        {currentExplanation["Step 3 Name"] || "Step 3"}
                      </Text>
                      <Text className="text-gray-800">
                        {currentExplanation["Step 3 Description"] || "No description available"}
                      </Text>
                    </View>
                  }

                  {/* Step 4 */}
                  {
                    currentExplanation["Step 4 Name"] && currentExplanation["Step 4 Description"] &&
                    <View className="bg-orange-50 p-3 rounded-lg mb-3 border border-orange-100">
                      <Text className="font-bold text-orange-800 mb-1">
                        {currentExplanation["Step 4 Name"] || "Step 4"}
                      </Text>
                      <Text className="text-gray-800">
                        {currentExplanation["Step 4 Description"] || "No description available"}
                      </Text>
                    </View>
                  }
                  
                  {/* Pro Tip */}
                  {currentExplanation["Pro Tip"] && (
                    <View className="bg-yellow-50 p-3 rounded-lg mb-2 border border-yellow-100">
                      <Text className="font-bold text-yellow-800 mb-1">
                        Pro Tip:
                      </Text>
                      <Text className="text-gray-800">
                        {currentExplanation["Pro Tip"]}
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <View className="bg-red-50 p-4 rounded-lg mb-3 border border-red-100">
                  <Text className="text-red-800 font-medium text-center">
                    No step-by-step explanation available for this question.
                  </Text>
                  
                  {currentQuestion?.["Formal Answer Explanation"] && (
                    <View className="mt-4">
                      <Text className="font-bold text-gray-800 mb-2">Formal Explanation:</Text>
                      <Text className="text-gray-700">
                        {currentQuestion["Formal Answer Explanation"]}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
             
            <TouchableOpacity
              onPress={closeExplanationModal}
              className="bg-gray-200 rounded-lg p-3 mt-4 items-center"
            >
              <Text className="font-bold text-gray-800">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GameOverScreen; 