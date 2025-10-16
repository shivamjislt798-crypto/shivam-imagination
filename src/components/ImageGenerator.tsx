import { useState } from 'react';
import { Loader2, Sparkles, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlassCard from './GlassCard';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

const ASPECT_MAP = {
  "1:1": { w: 1024, h: 1024, label: "Square" },
  "9:16": { w: 768, h: 1366, label: "Portrait" },
  "16:9": { w: 1366, h: 768, label: "Landscape" },
  "4:3": { w: 1200, h: 900, label: "Classic" },
  "21:9": { w: 1920, h: 824, label: "Ultra Wide" },
};


const processImageToAspect = (base64DataUrl: string, targetWidth: number, targetHeight: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const srcW = img.naturalWidth;
        const srcH = img.naturalHeight;
        const srcAspect = srcW / srcH;
        const targetAspect = targetWidth / targetHeight;

        let sx = 0, sy = 0, sWidth = srcW, sHeight = srcH;
        if (srcAspect > targetAspect) {
          sWidth = Math.round(srcH * targetAspect);
          sx = Math.round((srcW - sWidth) / 2);
        } else if (srcAspect < targetAspect) {
          sHeight = Math.round(srcW / targetAspect);
          sy = Math.round((srcH - sHeight) / 2);
        }

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get canvas context");
        
        ctx.clearRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
        
        const outDataUrl = canvas.toDataURL("image/png");
        resolve(outDataUrl);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image for processing"));
    img.src = base64DataUrl;
  });
};

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState<keyof typeof ASPECT_MAP>("1:1");
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
        title: 'Error',
        description: 'Please enter a prompt',
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
          title: 'Error',
          description: 'Please sign in to generate images',
          variant: 'destructive',
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, aspect }
      });

      if (error) throw error;

      if (data?.imageUrl) {
        const targetWidth = ASPECT_MAP[aspect].w;
        const targetHeight = ASPECT_MAP[aspect].h;
        
        const processedImage = await processImageToAspect(data.imageUrl, targetWidth, targetHeight);
        setGeneratedImage(processedImage);

        // @ts-ignore - Supabase types need regeneration
        await supabase.from('generations').insert([{
          user_id: user.id,
          prompt,
          image_url: processedImage,
          type: 'image'
        }] as any);

        toast({
          title: 'Success',
          description: 'Image generated successfully!',
          variant: 'success',
        });
      } else {
        throw new Error('No image URL received');
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate image',
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
        <div className="flex flex-wrap gap-2">
          {(Object.keys(ASPECT_MAP) as Array<keyof typeof ASPECT_MAP>).map((key) => (
            <Button
              key={key}
              onClick={() => setAspect(key)}
              variant={aspect === key ? "default" : "outline"}
              size="sm"
              disabled={isLoading}
              className={aspect === key ? "bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-90" : ""}
            >
              {key} <span className="ml-1 text-xs opacity-70">{ASPECT_MAP[key].label}</span>
            </Button>
          ))}
        </div>
        
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