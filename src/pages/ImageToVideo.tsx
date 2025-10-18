import Layout from '@/components/Layout';
import ReferenceImageGenerator from '@/components/ReferenceImageGenerator';
import { motion } from 'framer-motion';

const ImageToVideo = () => {
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
            Reference Image → Image Generation
          </h1>
          <p className="text-muted-foreground">
            Transform images using AI-guided reference-based generation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ReferenceImageGenerator />
        </motion.div>
      </div>
    </Layout>
  );
};

export default ImageToVideo;
