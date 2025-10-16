import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Sparkles, Image, Video, Wand2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import FeaturedGallery from '@/components/FeaturedGallery';
import ParticlesBackground from '@/components/ParticlesBackground';
import TypingAnimation from '@/components/TypingAnimation';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (type: 'image' | 'video' | 'image-to-video') => {
    if (type === 'image') {
      navigate('/generate');
    } else {
      // For future features
      console.log(`${type} feature coming soon`);
    }
  };

  return (
    <Layout>
      <div className="relative">
        {/* Particle Background */}
        <ParticlesBackground />
        
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 pt-12"
          >
            <h1 
              className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text animate-float tracking-wider capitalize"
              style={{
                backgroundImage: 'linear-gradient(90deg, #2fd4ff, #8b5cf6, #ff55ff, #ff9555)',
                backgroundSize: '400% 400%',
                animation: 'float 6s ease-in-out infinite, colorCycle 6s ease-in-out infinite'
              }}
            >
              Shivam Imagination
            </h1>
            <TypingAnimation />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6">
              Transform your imagination into stunning visuals and videos with the power of AI
            </p>
            <Button
              onClick={() => navigate('/generate')}
              className="bg-gradient-glow hover:opacity-90 text-primary-foreground font-semibold px-8 py-6 text-lg shadow-glow-violet hover:shadow-glow-blue transition-all hover:scale-105"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Text to Image - Active */}
            <motion.div
              onClick={() => handleFeatureClick('image')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer"
            >
              <GlassCard className="text-center space-y-4 h-full" glowColor="violet">
                <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                  <Image className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Text → Image</h3>
                <p className="text-muted-foreground text-sm">
                  Describe your imagination and watch it come to life as stunning images
                </p>
              </GlassCard>
            </motion.div>

            {/* Text to Video - Coming Soon */}
            <motion.div
              onClick={() => handleFeatureClick('video')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer relative"
            >
              <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-accent to-destructive text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-glow-orange animate-glow-pulse">
                🚧 Coming Soon
              </div>
              <GlassCard className="text-center space-y-4 h-full opacity-75 hover:opacity-100 transition-opacity" glowColor="blue">
                <div className="w-16 h-16 mx-auto bg-secondary/20 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Text → Video</h3>
                <p className="text-muted-foreground text-sm">
                  Create dynamic videos from your creative descriptions
                </p>
              </GlassCard>
            </motion.div>

            {/* Image to Video - Coming Soon */}
            <motion.div
              onClick={() => handleFeatureClick('image-to-video')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer relative"
            >
              <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-accent to-destructive text-primary-foreground px-3 py-1.5 rounded-full text-xs font-semibold shadow-glow-orange animate-glow-pulse">
                🚧 Coming Soon
              </div>
              <GlassCard className="text-center space-y-4 h-full opacity-75 hover:opacity-100 transition-opacity" glowColor="orange">
                <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
                  <Wand2 className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Image → Video</h3>
                <p className="text-muted-foreground text-sm">
                  Bring your static images to life with AI-powered animation
                </p>
              </GlassCard>
            </motion.div>
          </div>

          {/* Featured Gallery */}
          <FeaturedGallery />
        </div>
      </div>
    </Layout>
  );
};

export default Index;