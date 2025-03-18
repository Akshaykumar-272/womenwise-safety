
import { useState, useEffect, useRef } from 'react';
import { Share2, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SafetyMap = () => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get current location on component mount
  useEffect(() => {
    fetchCurrentLocation();
    
    // Set up interval to refresh location every 30 seconds
    const intervalId = setInterval(fetchCurrentLocation, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Load map once we have location
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      // In a real implementation, we would initialize a map library here
      // For this demo, we'll display the location info
      renderMapPlaceholder();
    }
  }, [currentLocation]);

  const fetchCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to access your location. Please check your location settings.",
            variant: "destructive",
          });
          setIsLoading(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const renderMapPlaceholder = () => {
    if (!mapRef.current || !currentLocation) return;
    
    const mapElement = mapRef.current;
    
    // Add a map placeholder with location info
    mapElement.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg p-4">
        <div class="text-center mb-4">
          <p class="font-medium mb-2">Your Current Location</p>
          <div class="bg-background p-2 rounded-md text-sm">
            ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}
          </div>
        </div>
        <div class="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="relative">
              <div class="absolute -top-1 -left-1 w-28 h-28 bg-safety-500/20 rounded-full animate-ping"></div>
              <div class="relative z-10 bg-safety-100 p-2 rounded-full">
                <MapPin className="h-5 w-5 text-safety-500" />
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-muted/80 to-transparent h-12"></div>
          <img 
            src="https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.lat},${currentLocation.lng}&zoom=15&size=600x400&markers=color:red%7C${currentLocation.lat},${currentLocation.lng}&key=DEMO_KEY" 
            alt="Map View"
            class="w-full h-full object-cover opacity-50"
          />
        </div>
        <p class="text-xs text-muted-foreground mt-2">
          This is a static map visualization. In a production app, an interactive map would be displayed.
        </p>
      </div>
    `;
  };

  const handleShareLocation = () => {
    setIsShareDialogOpen(true);
  };

  const sendLocationToContact = () => {
    if (!emergencyContact) {
      toast({
        title: "Missing Contact",
        description: "Please enter an emergency contact number",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentLocation) {
      toast({
        title: "Location Not Available",
        description: "Unable to share location. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a Google Maps URL with the current location
    const googleMapsUrl = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
    
    // In a real app, this would send an SMS or other notification with the location
    // For demo purposes, we'll simulate this with a toast
    
    toast({
      title: "Location Shared",
      description: `Your location has been sent to ${emergencyContact}`,
    });
    
    console.log(`Location ${googleMapsUrl} shared with contact ${emergencyContact}`);
    
    // In a real app with a backend, we would make an API call here to send the SMS
    
    setIsShareDialogOpen(false);
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-soft">
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-safety-500" />
            Safety Map
          </h3>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-safety-500 hover:border-safety-500" 
            onClick={handleShareLocation}
          >
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share Location
          </Button>
        </div>
        
        <div 
          ref={mapRef} 
          className="rounded-lg h-60 overflow-hidden relative"
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
              <div className="animate-pulse text-center">
                <MapPin className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Locating you...</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-muted/30">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-alert-500" />
          <p className="text-xs text-muted-foreground">
            Your location is only shared when you choose to do so
          </p>
        </div>
      </div>
      
      {/* Share Location Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Location</DialogTitle>
            <DialogDescription>
              Enter an emergency contact number to share your current location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Emergency Contact Number</label>
              <Input
                type="tel"
                placeholder="+1 (234) 567-8901"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
            
            {currentLocation && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Location to be shared</p>
                <p className="text-sm font-mono">
                  {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-safety-500 hover:bg-safety-600" 
              onClick={sendLocationToContact}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Send Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SafetyMap;
