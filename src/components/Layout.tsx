import { ReactNode } from 'react';
import { Home, Sparkles, History, Settings, Info, Key, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import cosmicBg from '@/assets/cosmic-bg.jpg';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Sparkles, label: 'Text → Image', path: '/generate/text-to-image' },
    { icon: Sparkles, label: 'Text → Video', path: '/generate/text-to-video' },
    { icon: Sparkles, label: 'Image → Video', path: '/generate/image-to-video' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Info, label: 'About', path: '/about' },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
        variant: 'success',
      });
      navigate('/auth');
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${cosmicBg})` }}
    >
      {/* Overlay for better contrast */}
      <div className="fixed inset-0 bg-gradient-cosmic opacity-80 pointer-events-none" />
      
      {/* Animated stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full animate-glow-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 p-6 backdrop-blur-glass bg-card/30 border-r border-border/50 flex flex-col">
          <div className="mb-12 animate-float">
            <h1 className="text-3xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-2">
              Shivam Imagination
            </h1>
            <p className="text-sm text-muted-foreground italic">Imagine. Generate. Create.</p>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary/20 text-primary shadow-glow-violet'
                      : 'hover:bg-muted/50 text-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted/50 text-foreground font-medium hover:bg-muted transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <p className="text-xs text-muted-foreground text-center">
              Created with imagination<br />
              Powered by Gemini & Veo
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;