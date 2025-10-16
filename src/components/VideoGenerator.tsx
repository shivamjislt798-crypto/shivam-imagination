import { useState } from 'react';
import { Loader2, Video } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlassCard from './GlassCard';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [resolution, setResolution] = useState('720p');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Empty prompt',
        description: 'Please describe the video you want to create',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setGeneratedVideo(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to generate videos.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: { prompt, duration, resolution },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.videoUrl) {
        setGeneratedVideo(data.videoUrl);
        const { error: saveError } = await (supabase as any)
          .from('generations')
          .insert({
            prompt,
            image_url: data.videoUrl,
            type: 'video',
            user_id: user.id
          });

        if (saveError) console.error('Failed to save generation:', saveError);

        toast({
          title: 'Video preview generated!',
          description: data.message || 'Your video preview has been created',
          variant: 'success',
        });
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="space-y-4 flex flex-col" glowColor="blue">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <span className="bg-gradient-glow bg-clip-text text-transparent">Text → Video</span>
        </h2>
      </div>

      <Textarea
        placeholder="Describe the video you want to create... (Press Enter to generate)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerate();
          }
        }}
        className="min-h-[100px] bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none"
        disabled={isLoading}
      />

      <div className="flex gap-2">
        <Select value={duration} onValueChange={setDuration} disabled={isLoading}>
          <SelectTrigger className="bg-input/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5s</SelectItem>
            <SelectItem value="10">10s</SelectItem>
            <SelectItem value="30">30s</SelectItem>
          </SelectContent>
        </Select>

        <Select value={resolution} onValueChange={setResolution} disabled={isLoading}>
          <SelectTrigger className="bg-input/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="720p">720p</SelectItem>
            <SelectItem value="1080p">1080p</SelectItem>
            <SelectItem value="4K">4K</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {generatedVideo && (
        <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-glow-blue animate-float">
          <video 
            src={generatedVideo} 
            controls 
            className="w-full h-auto"
          />
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-gradient-glow hover:opacity-90 text-primary-foreground font-semibold py-6 shadow-glow-blue hover:shadow-glow-violet transition-all hover:scale-[1.02]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Video className="w-5 h-5 mr-2" />
            Generate Video
          </>
        )}
      </Button>
    </GlassCard>
  );
};

export default VideoGenerator;
