import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Linking } from 'react-native';
import {
  Text,
  Button,
  Switch,
  RadioButton,
  TextInput,
  Divider,
  IconButton,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  setTheme,
  setRoundsPerGame,
  setPlayerConfig,
  setSoundEnabled,
  setVibrationEnabled,
  setAnimationSpeed,
  setBoardSize,
  resetSettings,
  THEMES,
} from '../store/settingsSlice';
import { X, Palette, Users, Volume2, Vibrate, Zap, RotateCcw, Github } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const [tempPlayer1Name, setTempPlayer1Name] = useState(settings.player1.name);
  const [tempPlayer2Name, setTempPlayer2Name] = useState(settings.player2.name);
  const [selectedTheme, setSelectedTheme] = useState(settings.theme.id);
  const [selectedRounds, setSelectedRounds] = useState(settings.roundsPerGame.toString());
  const [selectedAnimationSpeed, setSelectedAnimationSpeed] = useState(settings.animationSpeed);
  const [selectedBoardSize, setSelectedBoardSize] = useState(settings.boardSize || 'small');
  const insets = useSafeAreaInsets()

  // Auto-save theme and player names
  React.useEffect(() => {
    const newTheme = THEMES.find(theme => theme.id === selectedTheme) || THEMES[0];
    dispatch(setTheme(newTheme));
    dispatch(setPlayerConfig({ player: 1, config: { name: tempPlayer1Name, color: newTheme.colors.player1 } }));
    dispatch(setPlayerConfig({ player: 2, config: { name: tempPlayer2Name, color: newTheme.colors.player2 } }));
  }, [selectedTheme, tempPlayer1Name, tempPlayer2Name]);

  // Auto-save rounds
  React.useEffect(() => {
    dispatch(setRoundsPerGame(parseInt(selectedRounds)));
  }, [selectedRounds]);

  // Auto-save animation speed
  React.useEffect(() => {
    dispatch(setAnimationSpeed(selectedAnimationSpeed));
  }, [selectedAnimationSpeed]);

  // Auto-save board size
  React.useEffect(() => {
    dispatch(setBoardSize(selectedBoardSize as 'small' | 'large'));
  }, [selectedBoardSize]);

  const handleSave = () => {
    const newTheme = THEMES.find(theme => theme.id === selectedTheme) || THEMES[0];
    dispatch(setTheme(newTheme));
    dispatch(setRoundsPerGame(parseInt(selectedRounds)));
    dispatch(setPlayerConfig({ player: 1, config: { name: tempPlayer1Name, color: newTheme.colors.player1 } }));
    dispatch(setPlayerConfig({ player: 2, config: { name: tempPlayer2Name, color: newTheme.colors.player2 } }));
    dispatch(setAnimationSpeed(selectedAnimationSpeed));
    dispatch(setBoardSize(selectedBoardSize as 'small' | 'large'));
    if (navigation && navigation.goBack) navigation.goBack();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch(resetSettings());
            setTempPlayer1Name('Player 1');
            setTempPlayer2Name('Player 2');
            setSelectedTheme('classic');
            setSelectedRounds('3');
            setSelectedAnimationSpeed('normal');
          },
        },
      ]
    );
  };

  const currentTheme = THEMES.find(theme => theme.id === selectedTheme) || THEMES[0];

  return (
    <LinearGradient
      colors={currentTheme.colors.background}
      style={[styles.background,{ paddingTop: insets.top, paddingBottom: insets.bottom }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>Game Settings</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Palette size={20} color={currentTheme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Theme</Text>
          </View>
          <View style={styles.themeGrid}>
            {THEMES.map((theme) => (
              <View key={theme.id} style={styles.themeItem}>
                <RadioButton
                  value={theme.id}
                  status={selectedTheme === theme.id ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedTheme(theme.id)}
                  color={currentTheme.colors.accent}
                />
                <View style={styles.themePreview}>
                  <LinearGradient
                    colors={theme.colors.background}
                    style={[styles.themePreviewBox, { borderColor: theme.colors.border }]}
                  >
                    <View style={[styles.themeColorDot, { backgroundColor: theme.colors.player1 }]} />
                    <View style={[styles.themeColorDot, { backgroundColor: theme.colors.player2 }]} />
                  </LinearGradient>
                  <Text style={[styles.themeName, { color: currentTheme.colors.text }]}>{theme.name}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <Divider style={[styles.divider, { backgroundColor: currentTheme.colors.border }]} />
        {/* Player Configuration */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={currentTheme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Player Names</Text>
          </View>
          <View style={styles.playerConfig}>
            <View style={styles.playerItem}>
              <View style={[styles.playerColorIndicator, { backgroundColor: currentTheme.colors.player1 }]} />
              <TextInput
                label="Player 1 Name"
                value={tempPlayer1Name}
                onChangeText={setTempPlayer1Name}
                style={styles.playerInput}
                theme={{ colors: { primary: currentTheme.colors.accent, text: currentTheme.colors.text, background: 'transparent' } }}
              />
            </View>
            <View style={styles.playerItem}>
              <View style={[styles.playerColorIndicator, { backgroundColor: currentTheme.colors.player2 }]} />
              <TextInput
                label="Player 2 Name"
                value={tempPlayer2Name}
                onChangeText={setTempPlayer2Name}
                style={styles.playerInput}
                theme={{ colors: { primary: currentTheme.colors.accent, text: currentTheme.colors.text, background: 'transparent' } }}
              />
            </View>
          </View>
        </View>
        <Divider style={[styles.divider, { backgroundColor: currentTheme.colors.border }]} />
        {/* Rounds Per Game */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color={currentTheme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Rounds Per Game</Text>
          </View>
          <RadioButton.Group onValueChange={setSelectedRounds} value={selectedRounds}>
            <View style={styles.roundsGrid}>
              {['3', '5', '7'].map((rounds) => (
                <View key={rounds} style={styles.roundsItem}>
                  <RadioButton value={rounds} color={currentTheme.colors.accent} />
                  <Text style={[styles.roundsText, { color: currentTheme.colors.text }]}>Best of {rounds}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </View>
        <Divider style={[styles.divider, { backgroundColor: currentTheme.colors.border }]} />
        {/* Animation Speed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color={currentTheme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Animation Speed</Text>
          </View>
          <RadioButton.Group onValueChange={(value) => setSelectedAnimationSpeed(value as 'slow' | 'normal' | 'fast')} value={selectedAnimationSpeed}>
            <View style={styles.roundsGrid}>
              {['slow', 'normal', 'fast'].map((speed) => (
                <View key={speed} style={styles.roundsItem}>
                  <RadioButton value={speed} color={currentTheme.colors.accent} />
                  <Text style={[styles.roundsText, { color: currentTheme.colors.text }]}>{speed.charAt(0).toUpperCase() + speed.slice(1)}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </View>
        <Divider style={[styles.divider, { backgroundColor: currentTheme.colors.border }]} />
        {/* Board Size Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={currentTheme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Board Size</Text>
          </View>
          <RadioButton.Group onValueChange={(value) => setSelectedBoardSize(value as 'small' | 'large')} value={selectedBoardSize}>
            <View style={styles.roundsGrid}>
              {['small', 'large'].map((size) => (
                <View key={size} style={styles.roundsItem}>
                  <RadioButton value={size} color={currentTheme.colors.accent} />
                  <Text style={[styles.roundsText, { color: currentTheme.colors.text }]}>{size === 'small' ? 'Small' : 'Large'}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </View>
        <Divider style={[styles.divider, { backgroundColor: currentTheme.colors.border }]} />
        {/* Audio & Haptics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Volume2 size={20} color={currentTheme.colors.accent} />
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Audio & Haptics</Text>
          </View>
          <View style={styles.switchItem}>
            <Text style={[styles.switchLabel, { color: currentTheme.colors.text }]}>Sound Effects</Text>
            <Switch value={settings.soundEnabled} onValueChange={(value) => { dispatch(setSoundEnabled(value)); }} color={currentTheme.colors.accent} />
          </View>
          <View style={styles.switchItem}>
            <Text style={[styles.switchLabel, { color: currentTheme.colors.text }]}>Vibration</Text>
            <Switch value={settings.vibrationEnabled} onValueChange={(value) => { dispatch(setVibrationEnabled(value)); }} color={currentTheme.colors.accent} />
          </View>
        </View>
        <Divider style={[styles.divider, { backgroundColor: currentTheme.colors.border }]} />
        {/* Open Source */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.openSourceIcon, { color: currentTheme.colors.accent }]}>🔓</Text>
            <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Open Source</Text>
          </View>
          <View style={[styles.openSourceContainer, { backgroundColor: `${currentTheme.colors.accent}15`, borderColor: `${currentTheme.colors.accent}30` }]}>
            <Text style={[styles.openSourceTitle, { color: currentTheme.colors.text }]}>TriMorris is Open Source!</Text>
            <Text style={[styles.openSourceDescription, { color: currentTheme.colors.text }]}>
              This app is built with love and transparency. The complete source code is available on GitHub for everyone to explore, learn from, and contribute to.
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
            <Text style={[styles.githubUrl, { color: currentTheme.colors.accent }]}>
              github.com/shuraif/TriMorris
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* Footer removed for cleaner UI */}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeItem: {
    alignItems: 'center',
    width: '48%',
  },
  themePreview: {
    alignItems: 'center',
    marginTop: 5,
  },
  themePreviewBox: {
    width: 60,
    height: 40,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  themeColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeName: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  playerConfig: {
    gap: 15,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  playerColorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  playerInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  roundsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  roundsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundsText: {
    fontSize: 16,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
  divider: {
    marginVertical: 10,
    opacity: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 15,
  },
  resetButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  openSourceIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  openSourceContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  openSourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  openSourceDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    opacity: 0.9,
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

export default SettingsScreen;
