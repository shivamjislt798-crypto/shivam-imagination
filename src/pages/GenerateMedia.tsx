import Layout from '@/components/Layout';
import ImageGenerator from '@/components/ImageGenerator';
import VideoGenerator from '@/components/VideoGenerator';
import ImageToVideoGenerator from '@/components/ImageToVideoGenerator';
import { motion } from 'framer-motion';

const GenerateMedia = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-2 animate-float">
            Generate Media
          </h1>
          <p className="text-muted-foreground">
            Transform your imagination into stunning visuals and videos
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <ImageGenerator />
          </motion.div>
          <motion.div variants={itemVariants}>
            <VideoGenerator />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ImageToVideoGenerator />
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default GenerateMedia;
