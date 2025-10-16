import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'violet' | 'blue' | 'orange';
}

const GlassCard = ({ children, className, glowColor = 'violet' }: GlassCardProps) => {
  const glowClass = {
    violet: 'hover:shadow-glow-violet',
    blue: 'hover:shadow-glow-blue',
    orange: 'hover:shadow-glow-orange',
  }[glowColor];

  return (
    <motion.div 
      className={cn(
        "backdrop-blur-glass bg-card/60 border border-border/50 rounded-2xl p-6 transition-all",
        glowClass,
        "hover:border-primary/30",
        className
      )}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;