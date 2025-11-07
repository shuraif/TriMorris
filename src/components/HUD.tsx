import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RotateCcw, Play, Sparkles, Zap, Volume2, VolumeX } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PLAYER_COLORS } from '../constants/gameConstants';
import { useAppSelector } from '../store/hooks';

interface HUDProps {
  currentPlayer: string;
  winner: string | null;
  gamePhase: 'placement' | 'movement';
  tokensPlaced: { player1: number; player2: number };
  onRestart: () => void;
  children: React.ReactNode;
  score: { player1: number; player2: number };
  currentRound: number;
  matchWinner: string | null;
  onNextRound: () => void;
  onToggleSound?: () => void;
  soundEnabled?: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  currentPlayer,
  winner,
  gamePhase,
  tokensPlaced,
  onRestart,
  children,
  score,
  currentRound,
  matchWinner,
  onNextRound,
  onToggleSound,
  soundEnabled,
}) => {
  const settings = useAppSelector((state) => state.settings);
  
  // Use theme colors from settings
  const theme = settings.theme;
  const player1Color = settings.player1.color;
  const player2Color = settings.player2.color;

  return (
    <>
    <LinearGradient
      colors={theme.colors.background}
      style={styles.container}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      {/* Top Row with Player 1 Info and Buttons */}
      <View style={styles.topRowContainer}>
        {/* Audio toggle button on top left */}
        <TouchableOpacity style={styles.iconButton} onPress={onToggleSound}>
          <LinearGradient
            colors={['#FFD700', '#1E1A78']}
            style={styles.iconButtonGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            {soundEnabled ? (
              <Volume2 size={20} color="#FFFFFF" />
            ) : (
              <VolumeX size={20} color="#FFFFFF" />
            )}
          </LinearGradient>
        </TouchableOpacity>
        <LinearGradient
          colors={[player1Color, theme.colors.accent, theme.colors.background[2]]}
          style={[styles.playerSection, styles.inlinePlayerSection]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        >
          <View style={styles.playerInfo}>
            <Text style={styles.scoreNumber}>{score.player1}/{settings.roundsPerGame}</Text>
            <Text style={styles.playerLabel}>{settings.player1.name}</Text>
            <View style={styles.tokenDisplay}>
              {Array.from({ length: 3 }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.tokenIndicator,
                    {
                      backgroundColor: index < (3 - tokensPlaced.player1) ? player1Color : '#E0E0E0',
                      borderColor: player1Color,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>

        <TouchableOpacity style={styles.iconButton} onPress={onRestart}>
          <LinearGradient
            colors={['#4ECDC4', '#44A08D']}
            style={styles.iconButtonGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <RotateCcw size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
  </View>
      <View style={styles.gameArea}>
        {matchWinner ? (
          <LinearGradient
            colors={['#2D1B69', '#1E1A78', '#0B0C2A']}
            style={styles.winnerContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
          >
            <Text style={styles.winnerText}>
              🏆 {matchWinner === '1' ? settings.player1.name : settings.player2.name} Wins the Match! 🏆
            </Text>
            <View style={styles.scoreDisplay}>
              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>{settings.player1.name}</Text>
                <View style={styles.scoreIndicators}>
                  {Array.from({ length: settings.roundsPerGame }, (_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.scoreIndicator,
                        {
                          backgroundColor: index < score.player1 ? PLAYER_COLORS.PLAYER1 : 'rgba(255, 255, 255, 0.2)',
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.scoreSection}>
                <Text style={styles.scoreLabel}>{settings.player2.name}</Text>
                <View style={styles.scoreIndicators}>
                  {Array.from({ length: settings.roundsPerGame }, (_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.scoreIndicator,
                        {
                          backgroundColor: index < score.player2 ? PLAYER_COLORS.PLAYER2 : 'rgba(255, 255, 255, 0.2)',
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.buttonShadowContainer}>
              <TouchableOpacity style={styles.restartButton} onPress={onRestart}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.buttonGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                >
                  <View style={styles.buttonContent}>
                    <RotateCcw size={16} color="#FFFFFF" />
                    <Text style={styles.restartButtonText}>New Match</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ) : (
          <>
            {children}
          </>
        )}
      </View>

      {/* Player 2 Info (Bottom) */}
      <View style={styles.bottomRowContainer}>
        <View style={styles.invisibleButton} />
        <LinearGradient
          colors={[player2Color, theme.colors.accent, theme.colors.background[2]]}
          style={[styles.playerSection, styles.inlinePlayerSection, styles.bottomPlayerSection]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        >
          <View style={styles.playerInfo}>
            <Text style={styles.scoreNumber}>{score.player2}/{settings.roundsPerGame}</Text>
            <Text style={styles.playerLabel}>{settings.player2.name}</Text>
            <View style={styles.tokenDisplay}>
              {Array.from({ length: 3 }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.tokenIndicator,
                    {
                      backgroundColor: index < (3 - tokensPlaced.player2) ? player2Color : '#E0E0E0',
                      borderColor: player2Color,
                    },
                  ]}
                />
              ))}
            </View>
          </View>
        </LinearGradient>
        <View style={styles.invisibleButton} />
      </View>
    </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C2A', // Deep retro purple/navy background
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 8,
  },
  bottomRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 8,
  },
  iconButton: {
    backgroundColor: 'transparent', // Remove background for gradient
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  iconButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invisibleButton: {
    width: 40,
    height: 40,
  },
  playerSection: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    margin: 8,
    borderRadius: 25,
    elevation: 12,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 15,
    height: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
  },
  inlinePlayerSection: {
    flex: 1,
    margin: 0,
    marginHorizontal: 3,
  },
  activePlayerSection: {
    borderColor: '#00FFFF',
    borderWidth: 3,
    shadowColor: '#00FFFF',
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  topPlayerSection: {
    marginBottom: 5,
  },
  bottomPlayerSection: {
    marginTop: 5,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    flex: 1,
  },
  scoreNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'center',
    textShadowColor: '#FF6B6B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  playerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: '#4ECDC4',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  tokenDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tokenIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
  },
  matchScoreText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#4ECDC4',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  roundScoreText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#4ECDC4',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  nextRoundButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 48,
  },
  nextRoundButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 48,
  },
  buttonShadowContainer: {
    borderRadius: 20,
    elevation: 25,
    shadowColor: '#FF8E53',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    backgroundColor: 'rgba(255, 142, 83, 0.1)',
    width: 140,
    height: 48,
  },
  nextRoundShadowContainer: {
    borderRadius: 20,
    elevation: 25,
    shadowColor: '#44A08D',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 30,
    backgroundColor: 'rgba(68, 160, 141, 0.1)',
    width: 140,
    height: 48,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    width: '100%',
    marginTop: 15,
  },
  nextRoundButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  winnerContainer: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 25,
    elevation: 15,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    maxWidth: '90%',
    width: '90%',
  },
  winnerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: '#FF6B6B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 80,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  restartButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  scoreSection: {
    alignItems: 'center',
    flex: 0.4,
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: '#4ECDC4',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  scoreIndicators: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  scoreIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginHorizontal: 8,
    textShadowColor: '#FF6B6B',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    flex: 0.2,
    textAlign: 'center',
  },
});
