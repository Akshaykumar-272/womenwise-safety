import { useState } from 'react';
import { AlertTriangle, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const EmergencySOS = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  const handleActivateSOS = () => {
    setIsActive(true);
    setShowDialog(true);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  const cancelSOS = () => {
    setIsActive(false);
    setCountdown(3);
    setShowDialog(false);
    
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled",
      variant: "default",
    });
  };
  
  const triggerSOS = () => {
    // In a real app, this would send alerts, share location, etc.
    toast({
      title: "SOS Activated",
      description: "Emergency contacts notified with your location",
      variant: "destructive",
    });
    
    // Keep the dialog open but update the state
    setIsActive(true);
    
    // In a real app, this would start tracking and sending updates
    console.log("SOS emergency mode activated");
  };

  return (
    <div className="relative">
      <Button
        variant="destructive"
        size="lg"
        className={cn(
          "relative h-auto py-6 px-8 rounded-2xl transition-all duration-300",
          isActive 
            ? "bg-alert-600 animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.3)]" 
            : "bg-alert-500 hover:bg-alert-600 shadow-soft"
        )}
        onClick={handleActivateSOS}
      >
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className={cn("h-8 w-8", isActive && "animate-soft-bounce")} />
          <span className="font-medium text-lg">{isActive ? "SOS ACTIVE" : "Emergency SOS"}</span>
        </div>
      </Button>
      
      {/* Countdown Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-alert-500" />
                <h3 className="font-medium text-lg">Emergency SOS</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={cancelSOS}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {countdown > 0 ? (
              <>
                <p className="text-center mb-6">
                  Sending emergency alert in <span className="font-bold text-alert-500">{countdown}</span> seconds
                </p>
                <div className="w-full bg-muted rounded-full h-2 mb-6">
                  <div 
                    className="bg-alert-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(countdown / 3) * 100}%` }}
                  />
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={cancelSOS}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge className="bg-alert-500">Live</Badge>
                  <p className="font-medium">Alert sent to emergency contacts</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Your current location is being shared with your emergency contacts.
                    Stay on this screen until help arrives.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Current Location</p>
                    <p className="text-sm font-medium">123 Main Street, City Name</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-safety-500 hover:bg-safety-600"
                    size="lg"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Emergency Services
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-alert-500 text-alert-500 hover:bg-alert-50"
                    onClick={cancelSOS}
                  >
                    Deactivate SOS
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencySOS;
