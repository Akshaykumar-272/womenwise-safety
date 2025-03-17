
import { Heart, Clock, MapPin, Star, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const facilities = [
  { 
    id: 1, 
    name: 'City General Hospital', 
    type: 'Hospital', 
    open: '24/7',
    distance: '1.2 km',
    rating: 4.5,
  },
  { 
    id: 2, 
    name: 'Women\'s Health Clinic', 
    type: 'Clinic', 
    open: '8AM - 8PM',
    distance: '2.5 km',
    rating: 4.8,
  },
  { 
    id: 3, 
    name: 'Central Emergency Center', 
    type: 'Emergency', 
    open: '24/7',
    distance: '3.8 km',
    rating: 4.2,
  },
];

const MedicalFinder = () => {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-safety-500" />
            Medical Facilities
          </h3>
          <Button variant="outline" size="sm" className="h-8">
            View Map
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-safety-500"
                  >
                    <ExternalLink className="h-4 w-4" />
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
