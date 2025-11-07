import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated, Pressable, PanResponder } from 'react-native';
import { TOKEN_RADIUS, PLAYER_COLORS } from '../constants/gameConstants';

interface TokenProps {
  player: 1 | 2;
  x: number;
  y: number;
  isSelected?: boolean;
  onPress?: () => void;
  isHighlighted?: boolean;
  isCurrentPlayerToken?: boolean;
  isDraggable?: boolean;
  onDragEnd?: (x: number, y: number) => void;
  junctionId: number;
  color?: string; // Add optional color prop
}

export const Token: React.FC<TokenProps> = ({
  player,
  x,
  y,
  isSelected = false,
  onPress,
  isHighlighted = false,
  isCurrentPlayerToken = false,
  isDraggable = false,
  onDragEnd,
  junctionId,
  color: propColor,
}) => {
  const color = propColor || (player === 1 ? PLAYER_COLORS.PLAYER1 : PLAYER_COLORS.PLAYER2);
  const borderWidth = isSelected ? 0 : isHighlighted ? 3 : 2; // No border when selected
  const borderColor = isSelected ? 'transparent' : isHighlighted ? '#FFFFFF' : color;
  
  // Ripple animation for selected token
  const rippleScale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  
  // Glow animation for current player tokens
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  
  // Only use scale for visual feedback, no position animation
  const scale = useRef(new Animated.Value(1)).current;
  
  // Track drag offset manually (without Animated.ValueXY)
  const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  
  // PanResponder for both tap and drag functionality
  const panResponder = React.useMemo(() => 
    PanResponder.create({
      // Always capture touch events
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return isDraggable && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5);
      },

      onPanResponderGrant: () => {
        // Touch started - prepare for potential drag
        setIsDragging(true);
      },

      onPanResponderMove: (evt, gestureState) => {
        // Only update position and show drag feedback if it's draggable and has significant movement
        if (isDraggable && (Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10)) {
          // Show drag visual feedback
          Animated.spring(scale, {
            toValue: 1.3,
            useNativeDriver: false,
          }).start();
          
          // Update position during drag using manual offset
          setDragOffset({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        // Reset scale immediately
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: false,
        }).start();
        
        // Determine if this was a tap or drag
        const totalMovement = Math.abs(gestureState.dx) + Math.abs(gestureState.dy);
        
        if (isDraggable && totalMovement > 20) {
          // It was a drag - call drag handler
          const finalX = x + gestureState.dx;
          const finalY = y + gestureState.dy;
          console.log(`Token ${junctionId}: Drag ended at (${finalX}, ${finalY})`);
          onDragEnd?.(finalX, finalY);
        } else {
          // It was a tap - call tap handler  
          console.log(`Token ${junctionId}: Tap detected`);
          onPress?.();
        }
        
        // Reset the drag offset after a short delay to allow game state to update
        setTimeout(() => {
          setDragOffset({ x: 0, y: 0 });
          setIsDragging(false);
        }, 150);
      },
    }), [isDraggable, x, y, junctionId, onPress, onDragEnd]);
  
  // Reset drag offset when position changes (successful move)
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  }, [x, y]);
  
  useEffect(() => {
    if (isSelected) {
      // Start ripple animation
      const rippleAnimation = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(rippleScale, {
              toValue: 2,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(rippleOpacity, {
              toValue: 0.7,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rippleOpacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      rippleAnimation.start();
      
      return () => {
        rippleAnimation.stop();
        rippleScale.setValue(1);
        rippleOpacity.setValue(0);
      };
    } else {
      // Reset animation when not selected
      rippleScale.setValue(1);
      rippleOpacity.setValue(0);
    }
  }, [isSelected, rippleScale, rippleOpacity]);

  useEffect(() => {
    if (isCurrentPlayerToken && !isSelected) {
      // Start subtle glow animation for current player tokens
      const glowAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.8,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0.3,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      glowAnimation.start();
      
      return () => {
        glowAnimation.stop();
      };
    } else {
      glowOpacity.setValue(0);
    }
  }, [isCurrentPlayerToken, isSelected, glowOpacity]);

  return (
    <View style={{ position: 'absolute', left: x - TOKEN_RADIUS, top: y - TOKEN_RADIUS }}>
      {/* Glow effect for current player tokens */}
      {isCurrentPlayerToken && !isSelected && (
        <Animated.View
          style={[
            styles.currentPlayerGlow,
            {
              opacity: glowOpacity,
              shadowColor: color,
              borderColor: color,
            },
          ]}
        />
      )}
      
      {/* Ripple effect for selected token */}
      {isSelected && (
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
              backgroundColor: color,
            },
          ]}
        />
      )}
      
      {/* Main token */}
      <Animated.View
        style={[
          styles.token,
          {
            backgroundColor: color,
            borderWidth,
            borderColor,
            elevation: isCurrentPlayerToken ? 8 : 3, // Higher elevation for current player
            transform: [
              { scale: scale },
              { translateX: dragOffset.x },
              { translateY: dragOffset.y },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  token: {
    position: 'absolute',
    width: TOKEN_RADIUS * 2,
    height: TOKEN_RADIUS * 2,
    borderRadius: TOKEN_RADIUS,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ripple: {
    position: 'absolute',
    width: TOKEN_RADIUS * 2,
    height: TOKEN_RADIUS * 2,
    borderRadius: TOKEN_RADIUS,
    top: 0,
    left: 0,
  },
  currentPlayerGlow: {
    position: 'absolute',
    width: TOKEN_RADIUS * 2 + 8,
    height: TOKEN_RADIUS * 2 + 8,
    borderRadius: TOKEN_RADIUS + 4,
    top: -4,
    left: -4,
    borderWidth: 2,
    borderColor: '#FFD700',
    elevation: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
});
