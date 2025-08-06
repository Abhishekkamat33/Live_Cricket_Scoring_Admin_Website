// WinnerAnimation.tsx
'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const WinnerAnimation = ({ winner, onClose }: { winner: string; onClose: () => void }) => {

  return (
    <AnimatePresence>
      {winner && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              flexDirection: 'column',
              color: 'white',
              fontSize: '3rem',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '1rem',
              userSelect: 'none',
            }}
          >
            {winner === 'Draw' ? (
              <div>It's a Draw!</div>
            ) : (
              <div>🏆 {winner} Wins! 🏆</div>
            )}
            <button
              onClick={onClose}
              style={{
                marginTop: '2rem',
                padding: '0.5rem 1rem',
                fontSize: '1.2rem',
                cursor: 'pointer',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ffd700',
                color: '#000',
                fontWeight: 'bold',
              }}
            >
              Close
            </button>
          </motion.div>
          <Confetti recycle={false} numberOfPieces={300} />
        </>
      )}
    </AnimatePresence>
  );
};

export default WinnerAnimation;
