import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearMessage, nextRound } from '../store/gameSlice';
import { PLAYER_COLORS } from '../constants/gameConstants';

export const GameModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector((state) => state.game.message);
  const winner = useAppSelector((state) => state.game.winner);
  const matchWinner = useAppSelector((state) => state.game.matchWinner);
  const score = useAppSelector((state) => state.game.score);
  const currentRound = useAppSelector((state) => state.game.currentRound);
  const settings = useAppSelector((state) => state.settings);

  const hideModal = () => {
    dispatch(clearMessage());
  };

  const handleNextRound = () => {
    dispatch(clearMessage());
    dispatch(nextRound());
  };

  if (!message) return null;

  // Check if this is a round winner message
  const isRoundWinner = message.includes('Wins Round');

  return (
    <Portal>
      <Modal
        visible={!!message}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalWrapper}
        dismissable={false}
      >
        <LinearGradient
          colors={['#2D1B69', '#1E1A78', '#0B0C2A']}
          style={styles.modalContainer}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
        >
          <Text style={styles.messageText}>{message}</Text>
          
          {/* Show score display for round winner messages */}
          {isRoundWinner && (
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
                          backgroundColor: index < score.player1 ? settings.player1.color : 'rgba(255, 255, 255, 0.2)',
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
                          backgroundColor: index < score.player2 ? settings.player2.color : 'rgba(255, 255, 255, 0.2)',
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            {isRoundWinner ? (
              <View style={styles.buttonShadowContainer}>
                <Button 
                  mode="contained" 
                  onPress={handleNextRound} 
                  style={styles.button}
                  buttonColor="#4ECDC4"
                  textColor="#FFFFFF"
                  labelStyle={styles.buttonLabel}
                >
                  Next Round
                </Button>
              </View>
            ) : (
              <View style={styles.buttonShadowContainer}>
                <Button 
                  mode="contained" 
                  onPress={hideModal} 
                  style={styles.button}
                  buttonColor="#4ECDC4"
                  textColor="#FFFFFF"
                  labelStyle={styles.buttonLabel}
                >
                  OK
                </Button>
              </View>
            )}
          </View>
        </LinearGradient>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    margin: 20,
  },
  modalContainer: {
    padding: 25,
    borderRadius: 20,
    elevation: 15,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: '#4ECDC4',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    lineHeight: 24,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  buttonShadowContainer: {
    borderRadius: 15,
    elevation: 10,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  button: {
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 5,
    minWidth: 100,
  },
  buttonLabel: {
    fontSize: 16,
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
    fontSize: 16,
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
    fontSize: 14,
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
