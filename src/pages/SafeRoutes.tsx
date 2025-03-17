import { useEffect, useState } from 'react';
import { ArrowLeft, Navigation, Map, Shield, ExternalLink } from 'lucide-react';
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
  const [showDirections, setShowDirections] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    toast({
      title: "Safe Routes",
      description: "Find and navigate through safer paths",
    });
  }, [toast]);

  const handleRouteSelect = (routeType: string) => {
    setSelectedRoute(routeType);
    setShowDirections(true);
    toast({
      title: "Route Selected",
      description: `${routeType} route has been selected`,
    });
  };

  const handleFindRoute = () => {
    if (!startLocation || !destination) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and destination locations",
        variant: "destructive"
      });
      return;
    }

    setShowDirections(true);
    toast({
      title: "Route Found",
      description: "Safe route has been calculated",
    });
  };

  const openGoogleMaps = (origin: string, destination: string) => {
    if (!origin || !destination) {
      return;
    }
    
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
    
    window.open(googleMapsUrl, '_blank');
  };

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
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${selectedRoute === 'Safe Only' ? 'bg-safety-100 text-safety-700 border-safety-300' : ''}`}
                  onClick={() => handleRouteSelect('Safe Only')}
                >
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Safe Only
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`text-xs ${selectedRoute === 'All Routes' ? 'bg-muted/70 border-input/80' : ''}`}
                  onClick={() => handleRouteSelect('All Routes')}
                >
                  <Map className="h-3.5 w-3.5 mr-1.5" />
                  All Routes
                </Button>
              </div>
            </div>
            
            {!showDirections ? (
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Enter a start and destination to see the map</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Using real-time data to suggest safe paths</p>
                </div>
              </div>
            ) : (
              <div className="bg-safety-50 rounded-lg aspect-video relative flex items-center justify-center">
                <div className="absolute inset-0 p-4">
                  <div className="h-full w-full relative rounded-lg bg-white/90 shadow-sm overflow-hidden">
                    <div className="absolute left-[20%] top-[30%] h-3 w-3 rounded-full bg-safety-600 z-10 animate-pulse" />
                    <div className="absolute right-[25%] bottom-[25%] h-3 w-3 rounded-full bg-safety-600 z-10 animate-pulse" />
                    <div className={`absolute left-[21%] top-[31%] right-[26%] bottom-[26%] border-2 ${selectedRoute === 'Safe Only' ? 'border-safety-500' : 'border-muted-foreground/50'} rounded-full border-dashed z-5`} />
                    
                    {selectedRoute === 'All Routes' && (
                      <>
                        <div className="absolute left-[21%] top-[31%] right-[26%] bottom-[26%] border-2 border-alert-500/30 rounded-sm border-dashed z-4" />
                        <div className="absolute left-[15%] top-[40%] w-8 h-8 bg-alert-50 border border-alert-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-alert-700">!</span>
                        </div>
                      </>
                    )}
                    
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-md text-xs shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-safety-500" />
                        <span>Safe route</span>
                      </div>
                      {selectedRoute === 'All Routes' && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="h-2 w-2 rounded-full bg-alert-500" />
                          <span>Caution area</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="absolute top-2 right-2 bg-safety-500 hover:bg-safety-600"
                      size="sm"
                      onClick={() => openGoogleMaps(startLocation, destination)}
                    >
                      <ExternalLink className="mr-1 h-3.5 w-3.5" />
                      Open in Google Maps
                    </Button>
                  </div>
                </div>
                
                <div className="absolute top-2 right-2 bg-white shadow-md rounded-md p-3 w-48 text-xs">
                  <h4 className="font-medium mb-2 pb-1 border-b border-border/40">Directions</h4>
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-safety-100 text-safety-700 rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">1</span>
                      <span>Head north on Main St. for 0.5 miles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-safety-100 text-safety-700 rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">2</span>
                      <span>Turn right onto Oak Ave</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-safety-100 text-safety-700 rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0">3</span>
                      <span>Your destination will be on the left</span>
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <EnhancedRouteForm 
              setShowDirections={setShowDirections} 
              setStartLocation={setStartLocation}
              setDestination={setDestination}
              startLocation={startLocation}
              destination={destination}
            />
            <SafeNavigation />
          </div>
        </div>
      </main>
    </div>
  );
};

const EnhancedRouteForm = ({ 
  setShowDirections, 
  setStartLocation, 
  setDestination,
  startLocation,
  destination
}: { 
  setShowDirections: (show: boolean) => void;
  setStartLocation: (location: string) => void;
  setDestination: (location: string) => void;
  startLocation: string;
  destination: string;
}) => {
  const { toast } = useToast();

  return (
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
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
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
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Map className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        
        <Button 
          className="w-full bg-safety-500 hover:bg-safety-600"
          onClick={handleFindRoute}
        >
          <Navigation className="h-4 w-4 mr-2" />
          Find Safe Route
        </Button>
      </div>
    </div>
  );
};

export default SafeRoutes;
