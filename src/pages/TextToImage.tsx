import Layout from '@/components/Layout';
import ImageGenerator from '@/components/ImageGenerator';
import { motion } from 'framer-motion';

const TextToImage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-2 animate-float">
            Text → Image Generation
          </h1>
          <p className="text-muted-foreground">
            Transform your words into stunning visual masterpieces
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ImageGenerator />
        </motion.div>
      </div>
    </Layout>
  );
};

export default TextToImage;
