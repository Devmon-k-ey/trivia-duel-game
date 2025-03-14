import { useState, useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
}

const Timer: React.FC<TimerProps> = ({ isRunning, onTimeUpdate }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTime = useRef(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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
  
  // Reset timer when running state changes
  useEffect(() => {
    if (isRunning) {
      // Reset values when timer starts
      setElapsedTime(0);
      startTime.current = Date.now();
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start a new timer
      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const newElapsedTime = currentTime - startTime.current;
        
        setElapsedTime(newElapsedTime);
        onTimeUpdate(newElapsedTime);
      }, 1000);
    } else {
      // Stop the timer when not running
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    // Clean up function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);
  
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