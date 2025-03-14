// import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import { GameProvider } from './src/context/GameContext';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </GameProvider>
    </SafeAreaProvider>
  );
}
