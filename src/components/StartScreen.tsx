
import React, { useState } from 'react';
import { Modal } from 'react-native';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Settings, HelpCircle, Users, Bot, Github, Info } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { THEMES } from '../store/settingsSlice';
import { DemoBoard } from './DemoBoard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
} from 'react-native-paper';

const { width } = Dimensions.get('window');


interface StartScreenProps {
  navigation: any;
}

const StartScreen: React.FC<StartScreenProps> = ({ navigation }) => {
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const dispatch = useAppDispatch();
  const themeId = useAppSelector(state => state.settings.theme.id);
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const insets = useSafeAreaInsets()
  const settings = useAppSelector((state) => state.settings);
  const [selectedTheme, setSelectedTheme] = useState(settings.theme.id);
  const currentTheme = THEMES.find(theme => theme.id === selectedTheme) || THEMES[0];
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

    {/* About Modal */}
    <Modal
      visible={aboutVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setAboutVisible(false)}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background[2] + 'CC' }}>
        <View style={{ width: width > 400 ? 360 : '90%', backgroundColor: theme.colors.background[1], borderRadius: 18, padding: 30, borderWidth: 2, borderColor: theme.colors.accent, shadowColor: theme.colors.accent, shadowOpacity: 0.3, shadowRadius: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.accent, textAlign: 'center', marginBottom: 12 }}>About TriMorris</Text>
          
          <Text style={{ color: theme.colors.text, fontSize: 16, marginBottom: 18, textAlign: 'center', lineHeight: 22 }}>
            A modern take on the classic Three Men's Morris strategy game, built with React Native and love for timeless gameplay.
          </Text>

          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ color: theme.colors.accent, fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Version</Text>
            <Text style={{ color: theme.colors.text, fontSize: 14, marginBottom: 16 }}>1.3.0</Text>

            <Text style={{ color: theme.colors.accent, fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Open Source</Text>
            <Text style={{ color: theme.colors.text, fontSize: 14, textAlign: 'center', marginBottom: 16, lineHeight: 20 }}>
              This app is built with transparency and love. The complete source code is available on GitHub for everyone to explore, learn from, and contribute to.
            </Text>

            <Button
                mode="outlined"
                onPress={() => {
                  const url = 'https://github.com/shuraif/TriMorris';
                  
                  // Simple approach - just try to open the URL directly
                  Linking.openURL(url).catch(() => {
                    // If it fails, show the fallback alert
                    Alert.alert(
                      'Open GitHub Repository',
                      'Please visit our GitHub repository:\n\nhttps://github.com/shuraif/TriMorris\n\n⭐ Star the repo if you like the app!',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Copy Link', 
                          onPress: () => {
                            // You could implement Clipboard.setString here if needed
                            Alert.alert('Info', 'Please copy this link: https://github.com/shuraif/TriMorris');
                          }
                        }
                      ]
                    );
                  });
                }}
                style={[styles.githubButton, { borderColor: currentTheme.colors.accent }]}
                labelStyle={{ color: currentTheme.colors.accent, fontSize: 14 }}
                icon={({ size, color }) => <Github size={size} color={color} />}
              >
                View Source Code
          </Button>

            
          </View>

          <TouchableOpacity
            style={{ alignSelf: 'center', marginTop: 8, backgroundColor: theme.colors.accent, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 32 }}
            onPress={() => setAboutVisible(false)}
          >
            <Text style={{ color: theme.colors.background[1], fontWeight: 'bold', fontSize: 18 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

    {/* Main Action Buttons - grouped for better UI/UX */}
    <View style={{ width: '100%', justifyContent: 'center',alignItems:'center', marginTop: 8,flex:4 }}>
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
            <Text style={styles.buttonText}>Play with Bot</Text>
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
    {/* Bottom Buttons */}
    <View>
      {/* How to Play Button */}
      <TouchableOpacity
        style={[styles.button, { marginBottom: 10 }]}
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
            <HelpCircle size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>How to Play</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* About Button */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.95}
        onPress={() => setAboutVisible(true)}
      >
        <LinearGradient
          colors={theme.colors.button}
          style={styles.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Info size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>About</Text>
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
  secondaryButton: {
    width: width > 400 ? 260 : '90%',
    borderRadius: 12,
    marginVertical: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#666',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  secondaryButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
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
   githubButton: {
    marginBottom: 8,
  },
  githubUrl: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    fontFamily: 'monospace',
  },
});

export default StartScreen;
