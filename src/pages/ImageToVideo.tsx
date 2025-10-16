import Layout from '@/components/Layout';
import ImageToVideoGenerator from '@/components/ImageToVideoGenerator';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
            Image → Video Generation
          </h1>
          <p className="text-muted-foreground">
            Animate your images with AI-powered motion and effects
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Coming Soon Badge */}
          <div className="absolute -top-4 -right-4 z-20">
            <div className="bg-gradient-to-r from-accent via-primary to-accent bg-[length:200%_100%] animate-shimmer rounded-lg px-4 py-2 shadow-glow-violet flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse" />
              <span className="text-sm font-bold text-primary-foreground tracking-wider">
                🚧 COMING SOON
              </span>
            </div>
          </div>

          {/* Blurred overlay */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/60 backdrop-blur-sm z-10 rounded-2xl flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <h3 className="text-2xl font-bold bg-gradient-glow bg-clip-text text-transparent">
                  Feature in Development
                </h3>
                <p className="text-muted-foreground max-w-md">
                  🎬 Stay tuned! Image animation with advanced motion effects coming soon.
                </p>
              </div>
            </div>
            <ImageToVideoGenerator />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ImageToVideo;
