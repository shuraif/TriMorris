import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

const TOKEN_SIZE = 32;
const BOARD_SIZE = width * 0.7;
const TOKEN_COLORS = [
  '#FFD700', // Gold
  '#4ECDC4', // Teal
  '#FF6B6B', // Coral
  '#1E1A78', // Indigo
  '#A259F7', // Purple
];

// Simple animated token positions
const initialPositions = [
  { x: 0.15, y: 0.15, color: 0 },
  { x: 0.85, y: 0.15, color: 1 },
  { x: 0.15, y: 0.85, color: 2 },
  { x: 0.85, y: 0.85, color: 3 },
  { x: 0.5, y: 0.5, color: 4 },
];

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2D1B69',
    overflow: 'hidden',
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#2D1B69',
    top: BOARD_SIZE / 3,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#2D1B69',
    left: BOARD_SIZE / 3,
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 2,
    textAlign: 'center',
    fontFamily: 'System', // Use a sleek system font
    textShadowColor: 'rgba(30,26,120,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginTop: 12,
  },
});

type SplashScreenProps = {
  navigation: StackNavigationProp<any>;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  // Animated values for each token
  const anims = useRef(initialPositions.map(() => new Animated.ValueXY())).current;
  // Animated value for app name
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslate = useRef(new Animated.Value(24)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate tokens to random positions in a loop
    const animateTokens = () => {
      initialPositions.forEach((pos, i) => {
        const toX = Math.random() * 0.7 + 0.15;
        const toY = Math.random() * 0.7 + 0.15;
        Animated.loop(
          Animated.sequence([
            Animated.timing(anims[i], {
              toValue: { x: toX, y: toY },
              duration: 1800 + i * 200,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.quad),
            }),
            Animated.timing(anims[i], {
              toValue: { x: pos.x, y: pos.y },
              duration: 1800 + i * 200,
              useNativeDriver: false,
              easing: Easing.inOut(Easing.quad),
            }),
          ])
        ).start();
      });
    };
    animateTokens();
    // Animate transform/opacity with native driver only
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(titleTranslate, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(titleScale, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
        easing: Easing.out(Easing.elastic(1)),
      }),
    ]).start();
    // Navigate to StartScreen after 2 seconds
    const timer = setTimeout(() => {
      if (navigation && navigation.replace) {
        navigation.replace('StartScreen');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [anims, navigation, titleOpacity, titleTranslate, titleScale]);

  return (
    <LinearGradient
      colors={["#1E1A78", "#0B0C2A"]}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.boardContainer}>
        <View style={styles.board}>
          {/* Board grid lines */}
          <View style={styles.gridLineH} />
          <View style={[styles.gridLineH, { top: BOARD_SIZE / 2 }]} />
          <View style={styles.gridLineV} />
          <View style={[styles.gridLineV, { left: BOARD_SIZE / 2 }]} />
          {/* Animated tokens */}
          {initialPositions.map((pos, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: anims[i].x.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, BOARD_SIZE - TOKEN_SIZE],
                }),
                top: anims[i].y.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, BOARD_SIZE - TOKEN_SIZE],
                }),
                width: TOKEN_SIZE,
                height: TOKEN_SIZE,
                borderRadius: TOKEN_SIZE / 2,
                backgroundColor: TOKEN_COLORS[pos.color],
                shadowColor: '#000',
                shadowOpacity: 0.18,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                borderWidth: 2,
                borderColor: '#888',
                opacity: 0.92,
              }}
            />
          ))}
        </View>
      </View>
      <Animated.Text
        style={[styles.title, {
          opacity: titleOpacity,
          transform: [
            { translateY: titleTranslate },
            { scale: titleScale },
          ],
          color: styles.title.color, // Use static color
        }]}
      >
        TriMorris
      </Animated.Text>
    </LinearGradient>
  );
}
