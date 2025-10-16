import { useState } from 'react';
import { Loader2, Sparkles, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlassCard from './GlassCard';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download started',
        description: 'Your image is being downloaded',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download image',
        variant: 'destructive',
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Empty prompt',
        description: 'Please describe your imagination first',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to generate images.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        
        // Save to database with user_id
        const { error: saveError } = await (supabase as any)
          .from('generations')
          .insert({
            prompt,
            image_url: data.imageUrl,
            user_id: user.id,
            type: 'image'
          });

        if (saveError) {
          console.error('Failed to save generation:', saveError);
        }

        toast({
          title: 'Image generated!',
          description: 'Your imagination has been brought to life',
          variant: 'success',
        });
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="space-y-4 flex flex-col" glowColor="violet">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <span className="bg-gradient-glow bg-clip-text text-transparent">Text → Image</span>
        </h2>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <Textarea
          placeholder="Describe your imagination... (Press Enter to generate)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          className="min-h-[100px] bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground"
          disabled={isLoading}
        />

        {generatedImage && (
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-glow-violet">
              <img 
                src={generatedImage} 
                alt="Generated" 
                className="w-full h-auto"
              />
            </div>
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </Button>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full bg-gradient-glow hover:opacity-90 text-primary-foreground font-semibold py-6 shadow-glow-violet hover:shadow-glow-blue transition-all hover:scale-[1.02] mt-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Image
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

export default ImageGenerator;