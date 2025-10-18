import { useState, useRef } from 'react';
import { Loader2, Image as ImageIcon, Download, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlassCard from './GlassCard';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const ASPECT_RATIOS = [
  { value: '1:1', label: 'Square (1:1)', width: 1024, height: 1024 },
  { value: '16:9', label: 'Landscape (16:9)', width: 1536, height: 1024 },
  { value: '9:16', label: 'Portrait (9:16)', width: 1024, height: 1536 },
  { value: '4:3', label: 'Classic (4:3)', width: 1024, height: 768 },
  { value: '3:4', label: 'Portrait (3:4)', width: 768, height: 1024 },
];

const ReferenceImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setGeneratedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reference-generated-${Date.now()}.png`;
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
    if (!imageFile) {
      toast({
        title: 'No reference image',
        description: 'Please upload a reference image',
        variant: 'destructive',
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: 'Empty prompt',
        description: 'Please describe the transformation you want',
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

      const { data, error } = await supabase.functions.invoke('reference-image', {
        body: { 
          imageUrl: imagePreview,
          prompt, 
          aspectRatio 
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        
        const { error: saveError } = await (supabase as any)
          .from('generations')
          .insert({
            prompt: `Reference: ${prompt}`,
            image_url: data.imageUrl,
            type: 'image',
            user_id: user.id
          });

        if (saveError) console.error('Failed to save generation:', saveError);

        toast({
          title: 'Image generated!',
          description: 'Your transformed image is ready',
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
    <GlassCard className="space-y-4 flex flex-col" glowColor="orange">
      <div>
        <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
          <span className="bg-gradient-glow bg-clip-text text-transparent">Reference Image → Image</span>
        </h2>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!imagePreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-all hover:bg-accent/5 animate-glow"
        >
          <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">
            Click to upload reference image
          </p>
          <p className="text-xs text-muted-foreground/60">
            or drag and drop
          </p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-border/50">
          <img 
            src={imagePreview} 
            alt="Reference" 
            className="w-full h-auto"
          />
          <Button
            onClick={clearImage}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Textarea
        placeholder="Describe the transformation... (e.g., 'Make this more futuristic with neon lighting and galaxy effects')"
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

      <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isLoading}>
        <SelectTrigger className="bg-input/50 border-border/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ASPECT_RATIOS.map((ratio) => (
            <SelectItem key={ratio.value} value={ratio.value}>
              {ratio.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {generatedImage && (
        <div className="space-y-2">
          <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-glow-orange animate-float">
            <img 
              src={generatedImage} 
              alt="Generated" 
              className="w-full h-auto transition-transform hover:scale-[1.03]"
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
        disabled={isLoading || !imageFile || !prompt.trim()}
        className="w-full bg-gradient-glow hover:opacity-90 text-primary-foreground font-semibold py-6 shadow-glow-orange hover:shadow-glow-violet transition-all hover:scale-[1.02]"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <ImageIcon className="w-5 h-5 mr-2" />
            Generate Image
          </>
        )}
      </Button>
    </GlassCard>
  );
};

export default ReferenceImageGenerator;
