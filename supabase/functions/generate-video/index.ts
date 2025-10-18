import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    
    // Validate input with Zod schema
    const inputSchema = z.object({
      prompt: z.string()
        .trim()
        .min(3, { message: 'Prompt must be at least 3 characters' })
        .max(1000, { message: 'Prompt must be less than 1000 characters' }),
      duration: z.string().optional(),
      resolution: z.string().optional()
    });

    const validation = inputSchema.safeParse(requestData);
    
    if (!validation.success) {
      console.warn('Invalid input:', validation.error.errors);
      return new Response(
        JSON.stringify({ error: validation.error.errors[0].message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, duration, resolution } = validation.data;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating video with prompt:', prompt, 'duration:', duration, 'resolution:', resolution);

    // Generate storyboard images using Gemini
    const storyboardResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: `Create a cinematic key frame for this video concept: ${prompt}. Style: high quality, ${resolution}, cinematic composition.`
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!storyboardResponse.ok) {
      if (storyboardResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (storyboardResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Credits exhausted. Please add more credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const errorText = await storyboardResponse.text();
      console.error('AI gateway error:', storyboardResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate video storyboard' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const storyboardData = await storyboardResponse.json();
    const imageUrl = storyboardData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image generated in response');
      return new Response(
        JSON.stringify({ error: 'Failed to generate video frame' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Video preview frame generated successfully');
    
    // Return the generated frame as a video preview
    // Note: Full video generation requires additional video API integration
    return new Response(
      JSON.stringify({ 
        videoUrl: imageUrl,
        message: 'Video preview frame generated. Full video generation coming soon with Veo 2 integration.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-video function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
