import { useState, useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';
import { useGame } from '../context/GameContext';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
  timerId?: string;
}

const Timer: React.FC<TimerProps> = ({ isRunning, onTimeUpdate, timerId = 'default' }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const { registerTimer, unregisterTimer } = useGame();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  
  // Start pulse animation
  useEffect(() => {
    // Clean up any existing animation first
    if (pulseAnimationRef.current) {
      pulseAnimationRef.current.stop();
    }
    
    const pulseSequence = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]);
    
    // Only pulse when timer is running and after 5 seconds
    if (isRunning && elapsedTime > 5000) {
      pulseAnimationRef.current = Animated.loop(pulseSequence);
      pulseAnimationRef.current.start();
    } else {
      pulseAnim.setValue(1);
    }
    
    return () => {
      if (pulseAnimationRef.current) {
        pulseAnimationRef.current.stop();
      }
      pulseAnim.setValue(1);
    };
  }, [isRunning, elapsedTime > 5000]);
  
  // Use the global timer from GameContext
  useEffect(() => {
    const handleTimeUpdate = (time: number) => {
      setElapsedTime(time);
      onTimeUpdate(time);
    };
    
    if (isRunning) {
      registerTimer(timerId, handleTimeUpdate);
    } else {
      unregisterTimer(timerId);
    }
    
    return () => {
      unregisterTimer(timerId);
    };
  }, [isRunning, timerId, registerTimer, unregisterTimer, onTimeUpdate]);
  
  const formatTime = (timeMs: number) => {
    const seconds = Math.floor(timeMs / 1000);
    const milliseconds = Math.floor((timeMs % 1000) / 10);
    
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <Animated.View 
      className="bg-white/20 rounded-full py-2 px-5 items-center justify-center"
      style={{
        transform: [{ scale: pulseAnim }]
      }}
    >
      <Text className="font-mono font-bold text-white text-base">
        {formatTime(elapsedTime)}s
      </Text>
    </Animated.View>
  );
};

export default Timer;