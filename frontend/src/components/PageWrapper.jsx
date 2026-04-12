import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <motion.div
      // 1. Initial state (before it loads) - slightly lower and transparent
      initial={{ opacity: 0, y: 20 }}
      
      // 2. Animate to state (when it loads) - slides up and fades in
      animate={{ opacity: 1, y: 0 }}
      
      // 3. Exit state (when leaving the page) - slides up and fades out
      exit={{ opacity: 0, y: -20 }}
      
      // 4. The physics of the animation - smooth and premium
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for an "Apple-like" snap
      }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
}