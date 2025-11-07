/**
 * TriMorris - React Native 2D Game
 * A two-player strategy game using react-native-game-engine
 *
 * @format
 */


import React from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { store, persistor } from './src/store/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './src/components/StartScreen';
import { Game } from './src/components/Game';
import { AIGame } from './src/components/AIGame';
import SettingsScreen from './src/components/SettingsScreen';
import SplashScreen from './src/components/SplashScreen';

const Stack = createStackNavigator();


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="StartScreen" component={StartScreen} />
                <Stack.Screen name="Game" component={Game} />
                <Stack.Screen name="AIGame" component={AIGame} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
