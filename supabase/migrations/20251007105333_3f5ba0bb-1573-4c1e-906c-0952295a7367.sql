-- Add type column to generations table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'generations' 
    AND column_name = 'type'
  ) THEN
    ALTER TABLE public.generations ADD COLUMN type TEXT DEFAULT 'image';
    CREATE INDEX idx_generations_type ON public.generations(type);
  END IF;
END $$;