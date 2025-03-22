
import { useEffect } from 'react';
import { ArrowLeft, Shield, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import EmergencySOS from '@/components/EmergencySOS';
import TrustedContacts from '@/components/TrustedContacts';
import SafetyMap from '@/components/SafetyMap';
import { useIsMobile } from '@/hooks/use-mobile';

const Emergency = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Notify user about emergency page access
    toast({
      title: "Emergency Page",
      description: "Access emergency services and quick contact options",
    });

    // Request necessary permissions as soon as the page loads
    requestMediaPermissions();
  }, [toast]);

  // Request camera and microphone permissions
  const requestMediaPermissions = async () => {
    try {
      // First request location permission
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            console.log("Location permission granted");
          },
          (error) => {
            console.error("Location permission error:", error);
            toast({
              title: "Location Access Needed",
              description: "Please enable location services for emergency features",
              variant: "destructive"
            });
          }
        );
      }
      
      // Check and request camera permissions
      try {
        // Try with Permissions API first
        try {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          
          if (cameraPermission.state === 'granted') {
            console.log('Camera permissions already granted');
          } else {
            // Show toast for permission request
            toast({
              title: "Permission Required",
              description: "W-Safe needs camera and microphone access for emergency situations",
            });
            
            // Request permissions explicitly
            await requestCameraAndMicrophone();
          }
        } catch (err) {
          console.log('Permissions API not supported, trying direct media request');
          // Fall back to direct getUserMedia request
          await requestCameraAndMicrophone();
        }
      } catch (err) {
        console.error("Camera permission error:", err);
        toast({
          title: "Media Permission Issue",
          description: "Please enable camera/microphone access in your browser settings for emergency features",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };
  
  // Helper function to request camera and microphone
  const requestCameraAndMicrophone = async () => {
    try {
      // Start with video only for basic camera access
      const videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      
      // Stop video tracks after permission is granted
      videoStream.getVideoTracks().forEach(track => track.stop());
      
      // Now request audio permission
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      
      // Stop audio tracks
      audioStream.getAudioTracks().forEach(track => track.stop());
      
      console.log("Camera and microphone permissions granted");
      toast({
        title: "Permissions Granted",
        description: "W-Safe can now capture media during emergencies",
      });
    } catch (err) {
      console.error("Permission request error:", err);
      throw err; // Rethrow for the caller to handle
    }
  };

  const emergencyContacts = [
    { name: "Police", number: "100", icon: <Shield className="h-5 w-5" /> },
    { name: "Ambulance", number: "108", icon: <PhoneCall className="h-5 w-5" /> },
    { name: "Women's Helpline", number: "1091", icon: <Shield className="h-5 w-5" /> },
    { name: "Emergency Contact 1", number: "9391414022", icon: <PhoneCall className="h-5 w-5" /> },
    { name: "Emergency Contact 2", number: "7842522747", icon: <PhoneCall className="h-5 w-5" /> },
    { name: "Emergency Contact 3", number: "8019735081", icon: <PhoneCall className="h-5 w-5" /> },
  ];

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
          <h1 className="text-3xl font-medium">Emergency Assistance</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-medium mb-4">SOS Emergency Alert</h2>
            <p className="text-muted-foreground mb-6">
              Quickly activate emergency mode to alert your trusted contacts with your location, photos, and videos
            </p>
            
            <div className="flex justify-center mb-6">
              <EmergencySOS />
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Tap the SOS button to immediately notify your emergency contacts with your current location and situation
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-medium mb-4">Emergency Contacts</h2>
            
            <Tabs defaultValue="helplines" className="w-full">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="helplines" className="flex-1">Helplines</TabsTrigger>
                <TabsTrigger value="personal" className="flex-1">Personal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="helplines" className="space-y-4">
                {emergencyContacts.map(contact => (
                  <div 
                    key={contact.name} 
                    className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-safety-100 p-2 rounded-full text-safety-500">
                        {contact.icon}
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.number}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-safety-500 hover:bg-safety-600"
                      onClick={() => {
                        toast({
                          title: `Calling ${contact.name}`,
                          description: `Dialing ${contact.number}...`
                        });
                        setTimeout(() => {
                          window.location.href = `tel:${contact.number}`;
                        }, 500);
                      }}
                    >
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="personal" className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground mb-4">Add your personal emergency contacts</p>
                <Button 
                  variant="outline" 
                  className="border-safety-500 text-safety-700"
                  onClick={() => navigate('/contacts')}
                >
                  Manage Contacts
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SafetyMap />
          </div>
          
          <div>
            <TrustedContacts />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Emergency;
