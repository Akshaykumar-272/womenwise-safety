
import { MapPin, Navigation, AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SafeNavigation = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [routeFound, setRouteFound] = useState(false);
  const { toast } = useToast();
  
  const handleFindRoute = () => {
    if (!origin || !destination) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and destination locations",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    // In a real app, this would call a maps API
    setTimeout(() => {
      setIsSearching(false);
      setRouteFound(true);
      toast({
        title: "Route Found",
        description: "Safe route has been calculated",
      });
    }, 1500);
  };
  
  const openGoogleMaps = () => {
    if (!origin || !destination) {
      toast({
        title: "Missing Information",
        description: "Please enter both start and destination locations",
        variant: "destructive"
      });
      return;
    }
    
    // Create a Google Maps URL with the origin and destination for navigation
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
    
    // Open Google Maps in a new tab
    window.open(googleMapsUrl, '_blank');
    
    toast({
      title: "Opening Google Maps",
      description: "Navigation started in Google Maps",
    });
  };

  return (
    <div className="rounded-xl overflow-hidden bg-white border border-border/30 shadow-soft">
      <div className="p-5">
        <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-safety-500" />
          Safe Navigation
        </h3>
        
        <div className="space-y-3 mb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Current location"
              className="pl-10"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Destination"
              className="pl-10"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          
          <Button
            onClick={handleFindRoute}
            disabled={!origin || !destination || isSearching}
            className="w-full bg-safety-500 hover:bg-safety-600 transition-all duration-300"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                Finding safest route...
              </span>
            ) : (
              "Find Safe Route"
            )}
          </Button>
        </div>
      </div>
      
      <div className={`h-[200px] ${routeFound ? 'bg-safety-100' : 'bg-safety-50'} relative transition-colors duration-300`}>
        {/* Placeholder for map - in real app this would be an actual map */}
        {!routeFound ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Map preview would appear here</p>
          </div>
        ) : (
          <div className="absolute inset-0 p-2">
            {/* Mock map with route visualization */}
            <div className="h-full w-full relative rounded-lg bg-white/90 shadow-sm">
              <div className="absolute left-[20%] top-[30%] h-2 w-2 rounded-full bg-safety-600 z-10" />
              <div className="absolute right-[25%] bottom-[25%] h-2 w-2 rounded-full bg-safety-600 z-10" />
              <div className="absolute left-[21%] top-[31%] right-[26%] bottom-[26%] border-2 border-safety-500 rounded-full border-dashed z-5" />
              
              {/* Google Maps button */}
              <Button 
                className="absolute top-2 right-2 bg-safety-500 hover:bg-safety-600"
                size="sm"
                onClick={openGoogleMaps}
              >
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Open in Google Maps
              </Button>
            </div>
          </div>
        )}
        
        {/* Safety indicators */}
        <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-soft flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-alert-500" />
            <span className="text-xs font-medium flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-alert-500" />
              Avoid marked areas
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-safety-500" />
            <span className="text-xs font-medium">Safe path</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeNavigation;
