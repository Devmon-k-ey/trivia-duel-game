import { View, Text } from 'react-native';

interface PlayerInfoProps {
  playerId: number;
  score: number;
  isCurrentPlayer: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ 
  playerId, 
  score, 
  isCurrentPlayer 
}) => {
  const playerColor = playerId === 1 ? 'bg-blue-600' : 'bg-purple-600';
  const playerTextColor = playerId === 1 ? 'text-blue-600' : 'text-purple-600';
  
  return (
    <View className={`rounded-lg shadow-sm p-3 ${isCurrentPlayer ? 'bg-white border border-gray-200' : 'bg-gray-100'}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className={`w-8 h-8 rounded-full ${playerColor} items-center justify-center mr-2`}>
            <Text className="text-white font-bold">{playerId}</Text>
          </View>
          <Text className={`font-bold text-lg ${playerTextColor}`}>
            Player {playerId}
          </Text>
        </View>
        
        <View className="bg-gray-100 px-3 py-1 rounded-full">
          <Text className={`font-bold ${playerTextColor}`}>
            Score: {score}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default PlayerInfo;