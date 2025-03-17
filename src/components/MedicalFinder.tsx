
import { Heart, Clock, MapPin, Star, ExternalLink, Navigation } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const initialFacilities = [
  { 
    id: 1, 
    name: 'City General Hospital', 
    type: 'Hospital', 
    open: '24/7',
    distance: '1.2 km',
    rating: 4.5,
    address: '123 Main St, Downtown'
  },
  { 
    id: 2, 
    name: 'Women\'s Health Clinic', 
    type: 'Clinic', 
    open: '8AM - 8PM',
    distance: '2.5 km',
    rating: 4.8,
    address: '456 Oak Ave, Midtown'
  },
  { 
    id: 3, 
    name: 'Central Emergency Center', 
    type: 'Emergency', 
    open: '24/7',
    distance: '3.8 km',
    rating: 4.2,
    address: '789 Pine Blvd, Uptown'
  },
];

const MedicalFinder = () => {
  const [userLocation, setUserLocation] = useState('');
  const [facilities, setFacilities] = useState(initialFacilities);
  const [facilityType, setFacilityType] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!userLocation) {
      toast({
        title: "Missing Location",
        description: "Please enter your current location",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    // Simulate API call to find nearby facilities
    setTimeout(() => {
      // Filter based on facility type if needed
      let filtered = [...initialFacilities];
      if (facilityType !== 'all') {
        filtered = initialFacilities.filter(f => f.type.toLowerCase() === facilityType.toLowerCase());
      }
      
      // Update with new "search results"
      setFacilities(filtered);
      setIsSearching(false);
      
      toast({
        title: "Facilities Found",
        description: `Found ${filtered.length} medical facilities near you`,
      });
    }, 1500);
  };

  const openGoogleMapsDirections = (facility: typeof facilities[0]) => {
    if (!userLocation) {
      toast({
        title: "Missing Location",
        description: "Please enter your current location first",
        variant: "destructive"
      });
      return;
    }
    
    // Create Google Maps directions URL
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(userLocation)}&destination=${encodeURIComponent(facility.address)}&travelmode=driving`;
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank');
    
    toast({
      title: "Opening Directions",
      description: `Navigating to ${facility.name}`,
    });
  };

  const handleFacilityTypeChange = (type: string) => {
    setFacilityType(type);
    if (userLocation) {
      // Auto-search when changing facility type if location is already entered
      setIsSearching(true);
      setTimeout(() => {
        let filtered = [...initialFacilities];
        if (type !== 'all') {
          filtered = initialFacilities.filter(f => f.type.toLowerCase() === type.toLowerCase());
        }
        setFacilities(filtered);
        setIsSearching(false);
      }, 800);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-safety-500" />
            Medical Facilities
          </h3>
        </div>
        
        {/* Search section */}
        <div className="mb-5 space-y-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter your location"
              className="pl-10"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-xs flex-1 ${facilityType === 'all' ? 'bg-safety-100 text-safety-700 border-safety-300' : ''}`}
              onClick={() => handleFacilityTypeChange('all')}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-xs flex-1 ${facilityType === 'hospital' ? 'bg-safety-100 text-safety-700 border-safety-300' : ''}`}
              onClick={() => handleFacilityTypeChange('hospital')}
            >
              Hospitals
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className={`text-xs flex-1 ${facilityType === 'clinic' ? 'bg-safety-100 text-safety-700 border-safety-300' : ''}`}
              onClick={() => handleFacilityTypeChange('clinic')}
            >
              Clinics
            </Button>
          </div>
          
          <Button
            onClick={handleSearch}
            disabled={!userLocation || isSearching}
            className="w-full bg-safety-500 hover:bg-safety-600"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                Searching...
              </span>
            ) : (
              "Find Nearby Facilities"
            )}
          </Button>
        </div>
        
        <div className="space-y-4">
          {facilities.map((facility) => (
            <div key={facility.id} className="animate-fade-in" style={{ animationDelay: `${facility.id * 100}ms` }}>
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm group-hover:text-safety-600 transition-colors">
                      {facility.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs font-normal px-1.5 py-0 h-5 bg-safety-50 text-safety-700 border-safety-200"
                      >
                        {facility.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-safety-500"
                    onClick={() => openGoogleMapsDirections(facility)}
                    title="Get Directions"
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{facility.open}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{facility.distance}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{facility.rating}</span>
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {facility.address}
                </p>
              </div>
              
              {facility.id !== facilities.length && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Showing emergency medical facilities near your current location
        </p>
      </div>
    </Card>
  );
};

export default MedicalFinder;
