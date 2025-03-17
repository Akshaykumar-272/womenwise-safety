
import { MapPin, Navigation, AlertTriangle, Shield } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SafeNavigation = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleFindRoute = () => {
    if (!origin || !destination) return;
    
    setIsSearching(true);
    // In a real app, this would call a maps API
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
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
      
      <div className="h-[200px] bg-safety-50 relative">
        {/* Placeholder for map - in real app this would be an actual map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Map preview would appear here</p>
        </div>
        
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
