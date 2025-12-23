import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const typeMeta = {
  error: {
    icon: '🔥',
    bgColor: 'bg-gradient-to-br from-red-500/10 via-rose-400/5 to-pink-500/10',
    borderColor: 'border-red-400/30',
    glowColor: 'shadow-red-500/20',
    textColor: 'text-red-600',
    buttonGradient: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    emoji: '🚨'
  },
  success: {
    icon: '✨',
    bgColor: 'bg-gradient-to-br from-emerald-500/10 via-teal-400/5 to-cyan-500/10',
    borderColor: 'border-emerald-400/30',
    glowColor: 'shadow-emerald-500/20',
    textColor: 'text-emerald-600',
    buttonGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    emoji: '🎉'
  },
  info: {
    icon: '💡',
    bgColor: 'bg-gradient-to-br from-blue-500/10 via-sky-400/5 to-cyan-500/10',
    borderColor: 'border-blue-400/30',
    glowColor: 'shadow-blue-500/20',
    textColor: 'text-blue-600',
    buttonGradient: 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700',
    emoji: '📘'
  },
  warning: {
    icon: '⚠️',
    bgColor: 'bg-gradient-to-br from-amber-500/10 via-orange-400/5 to-yellow-500/10',
    borderColor: 'border-amber-400/30',
    glowColor: 'shadow-amber-500/20',
    textColor: 'text-amber-600',
    buttonGradient: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    emoji: '🚦'
  },
  celebration: {
    icon: '🎊',
    bgColor: 'bg-gradient-to-br from-purple-500/10 via-pink-400/5 to-rose-500/10',
    borderColor: 'border-purple-400/30',
    glowColor: 'shadow-purple-500/20',
    textColor: 'text-purple-600',
    buttonGradient: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
    emoji: '🥳'
  }
};

const Modal = ({
  open,
  title,
  message,
  type = 'info',
  onClose,
  actions = [],
  showCloseButton = true,
  autoClose = null,
  vibe = 'default', // 'default' | 'party' | 'minimal' | 'neon'
  animation = 'pop', // 'pop' | 'slide' | 'fade' | 'bounce'
  soundEffect = false,
  confettiOnOpen = false,
  floatingEmojis = [],
  gradientBackground = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [floatingEmojiList, setFloatingEmojiList] = useState([]);
  const audioRef = useRef(null);
  const modalRef = useRef(null);

  const meta = typeMeta[type] || typeMeta.info;

  // Sound effects
  useEffect(() => {
    if (soundEffect && open) {
      const sounds = {
        error: 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3',
        success: 'https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3',
        info: 'https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3',
        warning: 'https://assets.mixkit.co/sfx/preview/mixkit-warning-alarm-buzzer-1551.mp3'
      };
      
      if (audioRef.current) {
        audioRef.current.src = sounds[type] || sounds.info;
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [open, soundEffect, type]);

  // Confetti effect
  useEffect(() => {
    if (confettiOnOpen && open) {
      const confettiCount = 100;
      const newConfetti = [];
      
      for (let i = 0; i < confettiCount; i++) {
        newConfetti.push({
          id: i,
          x: Math.random() * 100,
          y: -10,
          rotation: Math.random() * 360,
          color: `hsl(${Math.random() * 360}, 100%, 60%)`,
          size: Math.random() * 10 + 5,
          velocity: Math.random() * 3 + 2
        });
      }
      
      setConfetti(newConfetti);
      
      const timer = setTimeout(() => {
        setConfetti([]);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [confettiOnOpen, open]);

  // Floating emojis
  useEffect(() => {
    if (floatingEmojis.length > 0 && open) {
      const newEmojis = floatingEmojis.map((emoji, index) => ({
        id: index,
        emoji,
        x: Math.random() * 80 + 10,
        y: 100,
        delay: index * 200
      }));
      
      setFloatingEmojiList(newEmojis);
      
      const timer = setTimeout(() => {
        setFloatingEmojiList([]);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [floatingEmojis, open]);

  // Animation presets
  const getAnimationProps = () => {
    const base = {
      initial: { scale: 0.8, opacity: 0, y: 20 },
      animate: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.8, opacity: 0, y: 20 },
      transition: { type: "spring", damping: 20, stiffness: 300 }
    };

    const animations = {
      pop: {
        initial: { scale: 0, rotate: -10 },
        animate: { scale: 1, rotate: 0 },
        exit: { scale: 0, rotate: 10 },
        transition: { type: "spring", damping: 15, stiffness: 400 }
      },
      slide: {
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -300, opacity: 0 },
        transition: { type: "spring", damping: 25 }
      },
      fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 }
      },
      bounce: {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
        transition: { type: "spring", damping: 10, stiffness: 100 }
      }
    };

    return animations[animation] || base;
  };

  // Vibe-based styling
  const getVibeStyles = () => {
    const vibes = {
      default: 'rounded-3xl',
      party: 'rounded-2xl animate-pulse border-4 border-dashed',
      minimal: 'rounded-xl border',
      neon: 'rounded-3xl border-2 neon-glow'
    };
    return vibes[vibe] || vibes.default;
  };

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  // Auto close
  useEffect(() => {
    let timer;
    if (autoClose && open) {
      timer = setTimeout(() => {
        handleClose();
      }, autoClose);
    }
    return () => clearTimeout(timer);
  }, [autoClose, open, handleClose]);

  if (!open && !isVisible && !isClosing) return null;

  return (
    <AnimatePresence>
      {(open || isClosing) && (
        <>
          <audio ref={audioRef} preload="auto" />
          
          {/* Backdrop with gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            {/* Animated gradient background */}
            {gradientBackground && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-gradient-shift" />
            )}
            
            {/* Confetti */}
            {confetti.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute rounded-full"
                initial={{ y: piece.y, x: `${piece.x}%`, rotate: 0 }}
                animate={{
                  y: '100vh',
                  rotate: 360,
                  transition: {
                    duration: 2,
                    ease: "easeOut"
                  }
                }}
                style={{
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  boxShadow: `0 0 10px ${piece.color}`
                }}
              />
            ))}

            {/* Floating emojis */}
            {floatingEmojiList.map((item) => (
              <motion.div
                key={item.id}
                className="absolute text-2xl"
                initial={{ y: '100%', x: `${item.x}%`, opacity: 0 }}
                animate={{
                  y: '-100%',
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  delay: item.delay / 1000,
                  duration: 3,
                  ease: "easeOut"
                }}
              >
                {item.emoji}
              </motion.div>
            ))}

            {/* Modal */}
            <motion.div
              ref={modalRef}
              {...getAnimationProps()}
              className={`relative max-w-md w-full ${getVibeStyles()} ${meta.bgColor} ${meta.borderColor} border ${meta.glowColor} backdrop-blur-lg overflow-hidden`}
              style={{
                boxShadow: `0 20px 60px ${meta.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.1)`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              
              {/* Icon decoration */}
              <div className="absolute -top-6 -right-6 text-6xl opacity-20">
                {meta.emoji}
              </div>

              {/* Header */}
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className={`text-4xl ${meta.textColor}`}
                  >
                    {meta.icon}
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.h3
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className={`text-2xl font-bold ${meta.textColor} mb-3`}
                    >
                      {title}
                    </motion.h3>
                    
                    {message && (
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                      >
                        {typeof message === 'string' ? (
                          message.split('\n').map((line, i) => (
                            <p key={i} className="text-gray-700 font-medium leading-relaxed">
                              {line}
                            </p>
                          ))
                        ) : (
                          message
                        )}
                      </motion.div>
                    )}
                  </div>
                  
                  {showCloseButton && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleClose}
                      className="group flex-shrink-0 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-gray-500 hover:text-gray-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 pb-8">
                <div className="flex items-center justify-end gap-4">
                  {actions.length > 0 ? (
                    actions.map((action, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          action.onClick?.();
                          if (action.autoClose !== false) handleClose();
                        }}
                        className={`px-6 py-3 font-bold rounded-xl text-white ${meta.buttonGradient} transition-all duration-200 flex items-center gap-2`}
                      >
                        {action.icon && <span className="text-lg">{action.icon}</span>}
                        <span>{action.label}</span>
                      </motion.button>
                    ))
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleClose}
                      className={`px-6 py-3 font-bold rounded-xl text-white ${meta.buttonGradient} transition-all duration-200`}
                    >
                      Close
                    </motion.button>
                  )}
                </div>
                
                {/* Auto-close indicator */}
                {autoClose && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: autoClose / 1000, ease: "linear" }}
                    className="mt-6 h-1 rounded-full bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
                  />
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Global animations */}
          <style jsx global>{`
            @keyframes shimmer {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            
            @keyframes gradient-shift {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
            }
            
            .animate-shimmer {
              animation: shimmer 3s infinite linear;
            }
            
            .animate-gradient-shift {
              background-size: 200% 200%;
              animation: gradient-shift 4s ease infinite;
            }
            
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            
            .neon-glow {
              box-shadow: 
                0 0 20px currentColor,
                0 0 40px currentColor,
                0 0 60px currentColor,
                inset 0 0 20px currentColor;
              animation: neon-pulse 2s infinite;
            }
            
            @keyframes neon-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;