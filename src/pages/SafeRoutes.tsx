
import { useEffect } from 'react';
import { ArrowLeft, Navigation, Map, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import SafeNavigation from '@/components/SafeNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

const SafeRoutes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    toast({
      title: "Safe Routes",
      description: "Find and navigate through safer paths",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-medium">Safe Routes</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Navigation Map</h2>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Safe Only
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Map className="h-3.5 w-3.5 mr-1.5" />
                  All Routes
                </Button>
              </div>
            </div>
            
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-muted-foreground">Map visualization will appear here</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Using real-time data to suggest safe paths</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-xl font-medium mb-4">Find Safe Route</h2>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Start Location</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Enter start point" 
                      className="w-full border border-input rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-safety-500"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Map className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Enter destination" 
                      className="w-full border border-input rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-safety-500"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Map className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                
                <Button className="w-full bg-safety-500 hover:bg-safety-600">
                  <Navigation className="h-4 w-4 mr-2" />
                  Find Safe Route
                </Button>
              </div>
            </div>
            
            <SafeNavigation />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SafeRoutes;
