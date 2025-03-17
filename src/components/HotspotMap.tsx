
import { MapPin, AlertTriangle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const hotspots = [
  { id: 1, name: 'Downtown Area', level: 'high', incidents: 23, time: 'Night' },
  { id: 2, name: 'Central Park', level: 'medium', incidents: 12, time: 'Evening' },
  { id: 3, name: 'West District', level: 'low', incidents: 5, time: 'Various' },
];

const getLevelColor = (level: string) => {
  switch (level) {
    case 'high': return 'text-alert-500 bg-alert-50 border-alert-200';
    case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200';
    case 'low': return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    default: return 'text-muted-foreground bg-muted border-border';
  }
};

const HotspotMap = () => {
  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-safety-500" />
            Safety Awareness
          </h3>
          <Button variant="outline" size="sm" className="h-8">
            View All
          </Button>
        </div>
        
        <div className="h-[180px] bg-safety-50 rounded-lg relative mb-4">
          {/* Placeholder for map - in real app this would be an actual map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Crime hotspot visualization</p>
          </div>
          
          {/* Safety infobox */}
          <div className="absolute top-3 left-3 right-3 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-soft">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-safety-500" />
              <p className="text-xs font-medium">Based on recent police reports</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {hotspots.map((hotspot) => (
            <div key={hotspot.id} className="animate-fade-in" style={{ animationDelay: `${hotspot.id * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">{hotspot.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-normal px-1.5 py-0 h-5 ${getLevelColor(hotspot.level)}`}
                      >
                        {hotspot.level} risk
                      </Badge>
                      <p className="text-xs text-muted-foreground">{hotspot.time}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-xs font-medium">
                  {hotspot.incidents} <span className="text-muted-foreground">incidents</span>
                </p>
              </div>
              
              {hotspot.id !== hotspots.length && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default HotspotMap;
