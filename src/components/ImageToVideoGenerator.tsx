import { useState, useRef } from 'react';
import { Loader2, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlassCard from './GlassCard';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const ImageToVideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast({
        title: 'No image',
        description: 'Please upload an image first',
        variant: 'destructive',
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: 'Empty prompt',
        description: 'Please describe how the image should animate',
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

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('image-to-video', {
          body: { imageData: base64Image, prompt },
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        if (data?.videoUrl) {
          setGeneratedVideo(data.videoUrl);
          const { error: saveError } = await (supabase as any)
            .from('generations')
            .insert({
              prompt: `Image to video: ${prompt}`,
              image_url: data.videoUrl,
              type: 'image-to-video',
              user_id: user.id
            });

          if (saveError) console.error('Failed to save generation:', saveError);

          toast({
            title: 'Animation preview generated!',
            description: data.message || 'Your animation preview has been created',
          });
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(imageFile);
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate video. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="space-y-4 flex flex-col" glowColor="orange">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <span className="bg-gradient-glow bg-clip-text text-transparent">Image → Video</span>
        </h2>
      </div>

      <div className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        {!imagePreview ? (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full h-48 border-2 border-dashed border-border/50 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors bg-input/20"
          >
            <Upload className="w-8 h-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Drag & drop or click to upload
            </span>
          </button>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border/50">
            <img src={imagePreview} alt="Upload preview" className="w-full h-48 object-cover" />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-destructive transition-colors"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <Textarea
          placeholder="Describe how this image should animate... (Press Enter to generate)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && imageFile) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          className="min-h-[80px] bg-input/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none"
          disabled={isLoading}
        />

        {generatedVideo && (
          <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-glow-orange animate-float">
            <video 
              src={generatedVideo} 
              controls 
              className="w-full h-auto"
            />
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={isLoading || !imageFile}
          className="w-full bg-gradient-glow hover:opacity-90 text-primary-foreground font-semibold py-6 shadow-glow-orange hover:shadow-glow-violet transition-all hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Generate Video
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};

export default ImageToVideoGenerator;
