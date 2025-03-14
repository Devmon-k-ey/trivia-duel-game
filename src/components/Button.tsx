import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false,
  variant = 'primary'
}) => {
  // Define color classes based on variant
  const getButtonClasses = () => {
    if (disabled) return 'bg-gray-300';
    
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 active:bg-blue-700';
      case 'secondary':
        return 'bg-purple-600 active:bg-purple-700';
      case 'success':
        return 'bg-green-600 active:bg-green-700';
      case 'danger':
        return 'bg-red-600 active:bg-red-700';
      default:
        return 'bg-blue-600 active:bg-blue-700';
    }
  };
  
  return (
    <TouchableOpacity
      className={`rounded-xl px-6 py-3 items-center justify-center shadow-md ${getButtonClasses()}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="text-white font-bold text-lg">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button; 