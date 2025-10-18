import { useState, useRef } from 'react';
import { Loader2, Video, Download, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlassCard from './GlassCard';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [resolution, setResolution] = useState('720p');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!generatedVideo) return;
    
    try {
      const response = await fetch(generatedVideo);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Download started',
        description: 'Your video is being downloaded',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Failed to download video',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 10MB',
        variant: 'destructive',
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearReferenceImage = () => {
    setReferenceImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        body: { prompt, duration, resolution, referenceImage },
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
          <span className="bg-gradient-glow bg-clip-text text-transparent">🎥 Text + Image → Video</span>
        </h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-prompt" className="text-sm font-medium">Video Description</Label>
        <Textarea
          id="video-prompt"
          placeholder="Describe your video idea (scene, style, mood...)"
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
      </div>

      <div className="space-y-2">
        <Label htmlFor="reference-image" className="text-sm font-medium">Upload Reference Image (Optional)</Label>
        <div 
          className={`relative border-2 border-dashed rounded-xl p-4 transition-all ${
            referenceImage 
              ? 'border-primary/50 bg-primary/5' 
              : 'border-border/50 bg-input/20 hover:border-primary/30 hover:bg-input/30'
          }`}
        >
          {referenceImage ? (
            <div className="space-y-2">
              <div className="relative rounded-lg overflow-hidden border border-border/50 shadow-glow-blue">
                <img 
                  src={referenceImage} 
                  alt="Reference" 
                  className="w-full h-auto max-h-48 object-cover"
                />
                <button
                  onClick={clearReferenceImage}
                  className="absolute top-2 right-2 p-1.5 bg-destructive/90 hover:bg-destructive rounded-full transition-all"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 text-destructive-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Reference image loaded • Max 10MB
              </p>
            </div>
          ) : (
            <label htmlFor="reference-image" className="cursor-pointer block">
              <input
                ref={fileInputRef}
                id="reference-image"
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isLoading}
              />
              <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Upload className="w-8 h-8" />
                <p className="text-sm font-medium">Click to upload reference image</p>
                <p className="text-xs">PNG, JPG, JPEG, WEBP • Max 10MB</p>
              </div>
            </label>
          )}
        </div>
      </div>

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
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-glow-blue animate-float">
            <video 
              src={generatedVideo} 
              controls 
              className="w-full h-auto"
            />
          </div>
          <Button
            onClick={handleDownload}
            variant="secondary"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Video
          </Button>
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
