import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Generation {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

const History = () => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGenerations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await (supabase as any)
        .from('generations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching generations:', error);
      } else {
        setGenerations(data || []);
      }
      setIsLoading(false);
    };

    fetchGenerations();

    // Subscribe to realtime updates for the current user
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('generations-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'generations',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            setGenerations(prev => [payload.new as Generation, ...prev]);
          }
        )
        .subscribe();

      return channel;
    };

    let channelPromise = setupRealtimeSubscription();

    return () => {
      channelPromise.then(channel => {
        if (channel) supabase.removeChannel(channel);
      });
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-8">
          Generation History
        </h1>
        
        {isLoading ? (
          <GlassCard>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </GlassCard>
        ) : generations.length === 0 ? (
          <GlassCard>
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Your generation history will appear here</p>
              <p className="text-sm mt-2">Start creating to see your masterpieces!</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((generation) => (
              <GlassCard key={generation.id} className="overflow-hidden p-0" glowColor="violet">
                <img 
                  src={generation.image_url} 
                  alt={generation.prompt}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 space-y-2">
                  <p className="text-sm text-foreground line-clamp-2">{generation.prompt}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(generation.created_at).toLocaleDateString()} at {new Date(generation.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;