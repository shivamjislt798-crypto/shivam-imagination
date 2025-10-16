-- Create generations table to store AI image generation history
CREATE TABLE public.generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view generations (public gallery style)
CREATE POLICY "Anyone can view generations"
  ON public.generations
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to create generations
CREATE POLICY "Anyone can create generations"
  ON public.generations
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries by creation date
CREATE INDEX idx_generations_created_at ON public.generations(created_at DESC);