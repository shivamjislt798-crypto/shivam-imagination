import Layout from '@/components/Layout';
import GlassCard from '@/components/GlassCard';

const Settings = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-8">
          Settings
        </h1>
        
        <GlassCard>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">API Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Manage your API keys and generation settings
              </p>
            </div>
            
            <div className="text-center py-8 text-muted-foreground">
              <p>Settings panel coming soon</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
};

export default Settings;