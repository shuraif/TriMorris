
import React, { useState } from 'react';
import { Modal } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Settings, HelpCircle, Users, Bot } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { THEMES } from '../store/settingsSlice';
import { DemoBoard } from './DemoBoard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');



interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);
  const dispatch = useAppDispatch();
  const themeId = useAppSelector(state => state.settings.theme.id);
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const insets = useSafeAreaInsets()
  return (
    <LinearGradient
      colors={theme.colors.background}
      style={[styles.background, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
  
  <View style={{ alignItems: 'center', marginTop: 20,width:'100%' }}>
     <Text style={styles.title}>TriMorris</Text>
    <Text style={styles.subtitle}>Retro Strategy Game</Text>   
  </View>
  <View style={styles.container}>
   
    
    {/* How to Play Modal */}
    <Modal
      visible={howToPlayVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setHowToPlayVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background[2] + 'CC' }}>
        <View style={{ width: width > 400 ? 360 : '90%', backgroundColor: theme.colors.background[1], borderRadius: 18, padding: 30, borderWidth: 2, borderColor: theme.colors.accent, shadowColor: theme.colors.accent, shadowOpacity: 0.3, shadowRadius: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.accent, textAlign: 'center', marginBottom: 12 }}>How to Play</Text>
          <Text style={{ color: theme.colors.text, fontSize: 16, marginBottom: 18, textAlign: 'center', lineHeight: 22 }}>
            TriMorris is a modern take on the classic two-player strategy game, Three Men’s Morris. The goal is to get three of your tokens in a row (horizontally, vertically, or diagonally).
          </Text>
          <Text style={{ color: theme.colors.accent, fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Game Phases:</Text>
          <Text style={{ color: theme.colors.text, fontSize: 15, marginBottom: 8 }}>
            1. <Text style={{ color: theme.colors.player1, fontWeight: 'bold' }}>Placement:</Text> Players take turns placing their 3 tokens on empty spots.
            {'\n'}2. <Text style={{ color: theme.colors.player2, fontWeight: 'bold' }}>Movement:</Text> Once all tokens are placed, players take turns moving their tokens to adjacent empty spots.
          </Text>
          <Text style={{ color: theme.colors.accent, fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>How to Win:</Text>
          <Text style={{ color: theme.colors.text, fontSize: 15, marginBottom: 18 }}>
            Get all three of your tokens in a straight line before your opponent does!
          </Text>
          {/* Simple Demo Animation */}
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            {/* Demo Board: 3x3 grid with animated token placement */}
            <DemoBoard />
          </View>
          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 8, backgroundColor: theme.colors.accent, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 32 }}
            onPress={() => setHowToPlayVisible(false)}
          >
            <Text style={{ color: theme.colors.background[1], fontWeight: 'bold', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    {/* Main Action Buttons - grouped for better UI/UX */}
    <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
  {/* Multiplayer */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.95}
        onPress={() => navigation.navigate('Game')}
      >
        <LinearGradient
          colors={theme.colors.button}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Multiplayer</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
  {/* Play with System */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.95}
  onPress={() => navigation.navigate('AIGame')}
      >
        <LinearGradient
          colors={theme.colors.button}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Play with System</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
  {/* Settings */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.95}
        onPress={() => navigation.navigate('Settings')}
      >
        <LinearGradient
          colors={theme.colors.button}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={22} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>Settings</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
    {/* How to Play Button at Bottom */}
    <View style={{ position: 'absolute', bottom: 60, left: 0, right: 0, alignItems: 'center' }}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.95}
        onPress={() => {
          setHowToPlayVisible(true);
          dispatch({ type: 'settings/setHasSeenHowToPlay', payload: true });
        }}
      >
        <LinearGradient
          colors={theme.colors.button}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={22} color="#FFF" style={{ marginRight: 10 }} />
            <Text style={styles.buttonText}>How to Play</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
    {/* <View style={styles.footerBox}>
      <Text style={styles.footerText}>© 2025 Retro Board Games</Text>
    </View> */}
  </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#FF6B6B',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
    marginBottom: 10,
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22,
    color: '#B8860B',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  descriptionBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: width > 400 ? 360 : '100%',
    shadowColor: '#B8860B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  description: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 22,
  },
  button: {
    width: width > 400 ? 260 : '90%',
    borderRadius: 12,
    marginVertical: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 32,
    right: 32,
    zIndex: 10,
    elevation: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  settingsButtonGradient: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  footerBox: {
    marginTop: 40,
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(139,69,19,0.3)',
  },
  footerText: {
    color: '#FFD700',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 1,
  },
});

export default StartScreen;
