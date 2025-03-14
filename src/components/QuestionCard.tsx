import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
  currentPlayer: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question,
  onSelectAnswer,
  disabled = false,
  currentPlayer
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<{key: string, text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const screenHeight = Dimensions.get('window').height;
  
  // Extract options from the question
  useEffect(() => {
    if (!question) {
      setIsLoading(true);
      return;
    }
    
    // Extract options from the question
    const extractedOptions: {key: string, text: string}[] = [];
    
    // Try multiple formats for option keys
    const optionFormats = [
      // Format: "Option A", "Option B", etc.
      ...[..."ABCDE"].map(letter => ({
        key: letter,
        propKey: `Option ${letter}` as keyof Question
      })),
      // Format: "OptionA", "OptionB", etc.
      ...[..."ABCDE"].map(letter => ({
        key: letter,
        propKey: `Option${letter}` as keyof Question
      })),
      // Format: "A", "B", etc.
      ...[..."ABCDE"].map(letter => ({
        key: letter,
        propKey: letter as keyof Question
      }))
    ];
    
    // Try to find options in any of the expected formats
    for (const format of optionFormats) {
      const optionValue = question[format.propKey];
      if (optionValue && typeof optionValue === 'string' && optionValue.trim() !== '') {
        extractedOptions.push({
          key: format.key,
          text: optionValue
        });
      }
    }
    
    // Set the extracted options
    setOptions(extractedOptions);
    
    // Mark loading as complete
    setIsLoading(false);
  }, [question]);
  
  const handleSelectAnswer = (option: string) => {
    setSelectedOption(option);
    onSelectAnswer(option);
  };
  
  const getOptionStyle = (option: string) => {
    if (selectedOption === option) {
      if (currentPlayer === 1) return 'border-blue-500 bg-blue-50';
      return 'border-purple-500 bg-purple-50'
    }
    return 'border-gray-300';
  };
  
  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-white rounded-xl shadow-sm">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-white rounded-xl shadow-sm">
      <ScrollView className="flex-1">
        <View className="p-5">
          <Text className="text-xl font-bold text-gray-800 mb-3">
            {question.Question || "No question text available"}
          </Text>
          
          {/* Display question image if available */}
          {question["IMG URL"] && question["IMG URL"] !== '' && (
            <View className="mb-4 items-center">
              <Image 
                source={{ uri: question["IMG URL"] }} 
                className="w-full rounded-lg"
                style={{ height: screenHeight * 0.2 }}
                resizeMode="contain"
              />
            </View>
          )}
          
          <View className="mt-3">
            {options.length > 0 ? (
              options.map(option => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => !disabled && handleSelectAnswer(option.key)}
                  disabled={disabled}
                  className={`border-2 rounded-lg p-4 mb-3 ${getOptionStyle(option.key)}`}
                >
                  <View className="flex-row items-center">
                    <View className={`h-8 w-8 rounded-full items-center justify-center mr-3 ${selectedOption === option.key ? (currentPlayer === 1 ?'bg-blue-500' : 'bg-purple-500') : 'bg-gray-200'}`}>
                      <Text className={`font-bold ${selectedOption === option.key ? 'text-white' : 'text-gray-700'}`}>
                        {option.key}
                      </Text>
                    </View>
                    <Text className={`font-medium ${selectedOption === option.key ? ((currentPlayer === 1 ?'text-blue-700' : 'text-purple-700')) : 'text-gray-700'}`}>
                      {option.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // Hidden silent fallback to prevent red error text from flashing
              <View className="rounded-lg p-4">
                {options.length === 0 && !isLoading && (
                  <View className="items-center py-4">
                    <ActivityIndicator size="small" color="#6B7280" />
                    <Text className="text-gray-500 mt-2 text-center">
                      Loading options...
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default QuestionCard;