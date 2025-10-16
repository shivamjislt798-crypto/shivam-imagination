import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { Github, Linkedin, Award, Briefcase, GraduationCap } from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
      <motion.div 
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <h1 className="text-4xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-2 animate-float">
            About Shivam Imagination
          </h1>
          <p className="text-muted-foreground">
            Bringing imagination to life through AI
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="space-y-6 mb-6" glowColor="violet">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-gradient-glow bg-clip-text text-transparent">Our Vision</span>
              </h2>
              <p className="text-foreground leading-relaxed">
                Shivam Imagination is an innovative platform that combines the power of artificial intelligence
                with human creativity. We believe in democratizing content creation, making it accessible to
                everyone regardless of their technical expertise.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-gradient-glow bg-clip-text text-transparent">Features</span>
              </h2>
              <ul className="space-y-3 text-foreground">
                <li className="flex items-start gap-2 hover:translate-x-2 transition-transform">
                  <span className="text-primary-glow">✨</span>
                  <span><strong>Text to Image:</strong> Transform your ideas into stunning visuals</span>
                </li>
                <li className="flex items-start gap-2 hover:translate-x-2 transition-transform">
                  <span className="text-primary-glow">✨</span>
                  <span><strong>Text to Video:</strong> Create dynamic videos from descriptions</span>
                </li>
                <li className="flex items-start gap-2 hover:translate-x-2 transition-transform">
                  <span className="text-primary-glow">✨</span>
                  <span><strong>Image to Video:</strong> Animate your static images</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="bg-gradient-glow bg-clip-text text-transparent">Technology</span>
              </h2>
              <p className="text-foreground leading-relaxed">
                Built with cutting-edge AI models including Gemini and Veo, our platform leverages
                the latest advancements in generative AI to deliver exceptional results.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="space-y-6" glowColor="blue">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-glow bg-clip-text text-transparent">
                Creator Profile
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all hover:scale-[1.02]">
                <div className="w-16 h-16 rounded-full bg-gradient-glow flex items-center justify-center text-2xl font-bold shadow-glow-violet">
                  SS
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-glow">Shivam Sagar</h3>
                  <p className="text-muted-foreground">Aspiring Full Stack Developer</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all hover:shadow-glow-blue">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="w-5 h-5 text-primary-glow" />
                    <h4 className="font-semibold">Education</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    B.Tech in Computer Science Engineering<br />
                    2nd Year Student<br />
                    Kothiwal Institute of Technology and Professional Studies
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all hover:shadow-glow-violet">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-5 h-5 text-primary-glow" />
                    <h4 className="font-semibold">Qualification</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pursuing B.Tech in Computer Science<br />
                    Specializing in Full Stack Development
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-muted/20 border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-5 h-5 text-primary-glow" />
                  <h4 className="font-semibold text-lg">About</h4>
                </div>
                <p className="text-foreground leading-relaxed">
                  Shivam Sagar is an enthusiastic and passionate Computer Science student dedicated to mastering 
                  modern software technologies. With a keen interest in full stack development, he focuses on 
                  building innovative, efficient, and user-friendly applications. His goal is to grow into a 
                  skilled professional capable of creating impactful digital solutions that combine creativity 
                  and technology.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-muted/20 border border-primary/20 shadow-glow-violet">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-primary-glow" />
                  <h4 className="font-semibold text-lg">Aim</h4>
                </div>
                <p className="text-primary-glow font-medium">
                  To become a professional software developer with expertise in Full Stack Development
                </p>
              </div>

              <div className="flex justify-center gap-6 pt-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-glow text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-glow-blue"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-glow text-primary-foreground font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-glow-violet"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              </div>

              <p className="text-center text-sm text-muted-foreground italic">
                Links coming soon...
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default About;