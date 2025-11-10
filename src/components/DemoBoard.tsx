import React from 'react';
import { View } from 'react-native';

// DemoBoard: Simple animated demo for How to Play modal
export function DemoBoard() {
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