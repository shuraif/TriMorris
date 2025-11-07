
import React, { useState } from 'react';
import { Modal } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Settings, HelpCircle, Users, Bot } from 'lucide-react-native';
import { SettingsModal } from './SettingsModal';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { THEMES } from '../store/settingsSlice';

const { width } = Dimensions.get('window');

// DemoBoard: Simple animated demo for How to Play modal
function DemoBoard() {
  const [step, setStep] = React.useState(0);
  React.useEffect(() => {
    if (step < 6) {
      const timer = setTimeout(() => setStep(step + 1), 700);
      return () => clearTimeout(timer);
    }
  }, [step]);
  // Junction positions (corners, midpoints, center)
  const junctions = [
    { x: 10, y: 10 },   // top-left
    { x: 60, y: 10 },   // top-mid
    { x: 110, y: 10 },  // top-right
    { x: 10, y: 60 },   // mid-left
    { x: 60, y: 60 },   // center
    { x: 110, y: 60 },  // mid-right
    { x: 10, y: 110 },  // bottom-left
    { x: 60, y: 110 },  // bottom-mid
    { x: 110, y: 110 }, // bottom-right
  ];
  // Demo token animation: alternate placement, then movement to win
  const tokens = Array(9).fill(null);
  // Placement phase: alternate, no line
  // Movement phase: move P1 token to form a line
  // Indices: 0=TL, 2=TR, 3=ML, 4=C, 6=BL, 8=BR
  const demoOrder = [
    { player: 'P1', index: 4 }, // P1 top-left
    { player: 'P2', index: 2 }, // P2 top-right
    { player: 'P1', index: 0 }, // P1 center
    { player: 'P2', index: 6 }, // P2 bottom-left
    { player: 'P1', index: 5 }, // P1 bottom-right (no line yet)
    { player: 'P2', index: 3 }, // P2 mid-left
  ];

  for (let i = 0; i <= step; i++) {
    if (step < 6) {
      tokens[demoOrder[i].index] = demoOrder[i].player;
    } else {
      // After placement, animate movement
      tokens[0] = 'P1'; // P1 moves to top-mid
      tokens[4] = 'P1'; // P1 center
      tokens[8] = 'P1'; // P1 bottom-right
      tokens[2] = 'P2'; // P2 top-right
      tokens[3] = 'P2'; // P2 mid-left
      tokens[6] = 'P2'; // P2 bottom-left
    }
    
  }
  

  return (
    <View style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginVertical: 8 }}>
      {/* Board background and lines */}
      <View style={{ position: 'absolute', width: 120, height: 120, borderRadius: 0, borderWidth: 2, borderColor: '#FFD700', backgroundColor: '#1E1A78' }}>
        {/* Outer square is handled by border */}
        {/* Vertical line - extend to touch borders */}
        <View style={{ position: 'absolute', left: 60, top: -2, width: 2, height: 120, backgroundColor: '#FFD700', borderRadius: 1 }} />
        {/* Horizontal line - extend to touch borders */}
        <View style={{ position: 'absolute', top: 60, left: -2, height: 2, width: 120, backgroundColor: '#FFD700', borderRadius: 1 }} />
        {/* Diagonal lines connecting corners (precise placement) */}
        <View style={{ position: 'absolute', left: 0, top: 0, width: 120, height: 120, pointerEvents: 'none' }}>
          {/* Top-left to bottom-right */}
          <View style={{ position: 'absolute', right: 60, top: -25, width: 2, height: 166, backgroundColor: '#FFD700', borderRadius: 1, transform: [{ rotate: '45deg' }], }} />
          {/* Top-right to bottom-left */}
          <View style={{ position: 'absolute', left: 56, top: -25, width: 2, height: 166, backgroundColor: '#FFD700', borderRadius: 1, transform: [{ rotate: '-45deg' }], }} />
        </View>
      </View>
      {/* Tokens on junctions */}
      {tokens.map((t, i) => (
        t ? (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: junctions[i].x - 11,
              top: junctions[i].y - 11,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: t === 'P1' ? '#44A08D' : '#FF6B6B',
              borderWidth: 2,
              borderColor: '#FFD700',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ) : null
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);
  const dispatch = useAppDispatch();
  const themeId = useAppSelector(state => state.settings.theme.id);
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  return (
    <LinearGradient
      colors={theme.colors.background}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SettingsModal visible={settingsVisible} onDismiss={() => setSettingsVisible(false)} />
  
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
        onPress={() => setSettingsVisible(true)}
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
    <View style={{ position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' }}>
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

export default StartScreen;
