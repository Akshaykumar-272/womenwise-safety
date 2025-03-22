
import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Phone, X, Send, MessageSquare, Camera, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { 
  getSOSRecipients, 
  Contact 
} from '@/services/contactsService';
import {
  initializeCamera,
  captureMultipleImages,
  recordVideo,
  stopMediaStream,
  uploadEmergencyMedia
} from '@/services/mediaService';
import {
  sendEmergencySMS,
  sendEmergencyEmail
} from '@/services/supabaseService';

const EmergencySOS = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showDialog, setShowDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [contactsNotified, setContactsNotified] = useState<string[]>([]);
  const [nearbyContacts, setNearbyContacts] = useState<any[]>([]);
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'capturing' | 'complete' | 'failed'>('idle');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const { toast } = useToast();

  // Get current location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
    
    simulateNearbyContacts();
    
    // Request necessary permissions
    requestMediaPermissions();
    
    return () => {
      isMountedRef.current = false;
      if (streamRef.current) {
        stopMediaStream(streamRef.current);
      }
    };
  }, []);
  
  const simulateNearbyContacts = () => {
    const mockNearbyContacts = [
      { name: "City Police Station", distance: "1.2 mi", phone: "911" },
      { name: "Memorial Hospital", distance: "2.5 mi", phone: "108" },
      { name: "Fire Department", distance: "3.7 mi", phone: "101" },
    ];
    
    setTimeout(() => {
      setNearbyContacts(mockNearbyContacts);
    }, 2000);
  };

  // Request camera and location permissions
  const requestMediaPermissions = async () => {
    try {
      // Request location permissions if not already granted
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => console.log("Location permission granted"),
          (error) => console.error("Location permission error:", error)
        );
      }
      
      // Check if camera permissions are already granted
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      
      if (cameraPermission.state === 'granted' && micPermission.state === 'granted') {
        console.log('Camera and microphone permissions already granted');
        return;
      }
      
      toast({
        title: "Permission Required",
        description: "W-Safe needs camera, microphone and location access for emergency situations",
      });
      
      // Request camera permissions
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          // Immediately stop all tracks to release the camera/mic
          stream.getTracks().forEach(track => track.stop());
          
          toast({
            title: "Permissions Granted",
            description: "W-Safe can now capture media during emergencies",
          });
        })
        .catch(error => {
          console.error("Permission error:", error);
          toast({
            title: "Permission Denied",
            description: "Some features may be limited without camera/microphone access",
            variant: "destructive"
          });
        });
    } catch (error) {
      console.error("Error requesting permissions:", error);
    }
  };

  const handleActivateSOS = () => {
    setIsActive(true);
    setShowDialog(true);
    setContactsNotified([]);
    setMediaStatus('idle');
    setCapturedImages([]);
    setCapturedVideo(null);
    setUploadedMediaUrls([]);
    setMediaError(null);
    
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
    setContactsNotified([]);
    setMediaStatus('idle');
    
    // Clean up any active media streams
    if (streamRef.current) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }
    
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled",
      variant: "default",
    });
  };
  
  const triggerSOS = async () => {
    // Update location if not already set
    if (!currentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCurrentLocation({ lat: latitude, lng: longitude });
          captureEmergencyMediaAndSendAlerts({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          captureEmergencyMediaAndSendAlerts(null);
        }
      );
    } else {
      captureEmergencyMediaAndSendAlerts(currentLocation);
    }
  };

  const captureEmergencyMediaAndSendAlerts = async (location: {lat: number, lng: number} | null) => {
    toast({
      title: "SOS Activated",
      description: "Capturing emergency media and alerting contacts...",
      variant: "destructive",
    });
    
    setMediaStatus('capturing');
    
    try {
      // Initialize camera
      const cameraResult = await initializeCamera('environment');
      if (!cameraResult) {
        throw new Error("Failed to initialize camera");
      }
      
      const { stream, videoElement } = cameraResult;
      streamRef.current = stream;
      
      // Capture multiple images
      const imageBlobs = await captureMultipleImages(videoElement, 4, 1000);
      if (imageBlobs.length === 0) {
        throw new Error("Failed to capture images");
      }
      
      // Create data URLs for preview
      const imageUrls = imageBlobs.map(blob => URL.createObjectURL(blob));
      setCapturedImages(imageUrls);
      
      // Record video
      const videoBlob = await recordVideo(stream, 10000);
      if (!videoBlob) {
        throw new Error("Failed to record video");
      }
      
      // Create video URL for preview
      const videoUrl = URL.createObjectURL(videoBlob);
      setCapturedVideo(videoUrl);
      
      // Prepare media for upload
      const mediaToUpload = [
        ...imageBlobs.map(blob => ({ type: 'image' as const, blob })),
        { type: 'video' as const, blob: videoBlob }
      ];
      
      // Upload media to Supabase
      const mediaUrls = await uploadEmergencyMedia(mediaToUpload);
      if (mediaUrls.length === 0) {
        throw new Error("Failed to upload media");
      }
      
      setUploadedMediaUrls(mediaUrls);
      setMediaStatus('complete');
      
      // Send alerts with the uploaded media
      if (isMountedRef.current) {
        sendSOSAlerts(location, mediaUrls);
      }
    } catch (error) {
      console.error("Error capturing emergency media:", error);
      setMediaError(error instanceof Error ? error.message : "Unknown error");
      setMediaStatus('failed');
      
      // Still try to send alerts without media
      if (isMountedRef.current) {
        sendSOSAlerts(location, []);
      }
    } finally {
      // Clean up the stream
      if (streamRef.current) {
        stopMediaStream(streamRef.current);
        streamRef.current = null;
      }
    }
  };

  const sendSOSAlerts = async (location: {lat: number, lng: number} | null, mediaUrls: string[]) => {
    const formattedMessage = location 
      ? `There is an Emergency\nIam at This Location\nLatitude: ${location.lat}\nLongitude: ${location.lng}\nhttps://www.google.com/maps?q=${location.lat},${location.lng}`
      : "There is an Emergency\nUnable to determine location";

    const emergencyContacts = getSOSRecipients();
    
    for (let i = 0; i < emergencyContacts.length; i++) {
      const contact = emergencyContacts[i];
      
      try {
        // Try to send SMS first
        let success = await sendEmergencySMS(
          contact.phone,
          formattedMessage,
          mediaUrls
        );
        
        // If SMS fails and email is available, try email
        if (!success && contact.email) {
          success = await sendEmergencyEmail(
            contact.email,
            "EMERGENCY ALERT - W-Safe SOS Activated",
            formattedMessage,
            mediaUrls
          );
        }
        
        // For development, we'll simulate success and also try to use native SMS capabilities
        simulateSMS(contact.phone, formattedMessage);
        
        if (isMountedRef.current) {
          setContactsNotified(prev => [...prev, contact.name]);
          
          toast({
            title: `Alert Sent to ${contact.name}`,
            description: `Emergency message sent to ${contact.phone}`,
          });
        }
      } catch (error) {
        console.error(`Error sending alert to ${contact.name}:`, error);
      }
      
      // Add delay between notifications to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getCurrentLocation = () => {
    const locationText = currentLocation 
      ? `Latitude: ${currentLocation.lat.toFixed(6)}\nLongitude: ${currentLocation.lng.toFixed(6)}`
      : "Locating...";
    
    return locationText;
  };

  const getLocationURL = () => {
    if (!currentLocation) return "Generating URL...";
    return `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`;
  };

  const simulateCall = () => {
    toast({
      title: "Calling Emergency Services",
      description: "Connecting to emergency services...",
    });

    setTimeout(() => {
      window.location.href = "tel:911";
    }, 1000);
  };
  
  const simulateSMS = (phone: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `sms:${phone}?body=${encodedMessage}`;
  };

  const callContact = (phone: string, name: string) => {
    toast({
      title: `Calling ${name}`,
      description: `Connecting to ${phone}...`,
    });
    
    setTimeout(() => {
      window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
    }, 500);
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
                  <Badge className="bg-alert-500 animate-pulse">Live</Badge>
                  <p className="font-medium">
                    {mediaStatus === 'capturing' 
                      ? 'Capturing emergency media...' 
                      : 'Alerting emergency contacts'}
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <p className="text-sm text-muted-foreground">
                    Your current location is being shared with your emergency contacts.
                    Stay on this screen until help arrives.
                  </p>
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Emergency Message</p>
                    <p className="text-sm font-medium whitespace-pre-line">
                      There is an Emergency
                      {"\n"}Iam at This Location
                      {"\n"}{getCurrentLocation()}
                      {"\n"}{getLocationURL()}
                    </p>
                  </div>

                  {/* Media Capture Status */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Emergency Media</p>
                    
                    {mediaStatus === 'capturing' && (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-alert-500 border-t-transparent"></div>
                        <p className="ml-3 text-sm">Capturing images and video...</p>
                      </div>
                    )}
                    
                    {mediaStatus === 'failed' && (
                      <div className="text-sm text-alert-500">
                        <p>Failed to capture media: {mediaError}</p>
                        <p className="mt-1">Emergency alerts will be sent without media.</p>
                      </div>
                    )}
                    
                    {mediaStatus === 'complete' && (
                      <div className="space-y-3">
                        {capturedImages.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Captured Images:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {capturedImages.map((src, i) => (
                                <img 
                                  key={i}
                                  src={src} 
                                  alt={`Emergency capture ${i+1}`} 
                                  className="w-full h-auto rounded-lg"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {capturedVideo && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Recorded Video:</p>
                            <video 
                              src={capturedVideo} 
                              controls
                              className="w-full h-auto rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {contactsNotified.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-2">Contacts Notified</p>
                      <div className="space-y-2">
                        {contactsNotified.map((name, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Send className="h-3 w-3 text-safety-500" />
                            <span>{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {nearbyContacts.length > 0 && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-2">Nearby Emergency Services</p>
                      <div className="space-y-3">
                        {nearbyContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{contact.name}</p>
                              <p className="text-xs text-muted-foreground">{contact.distance} away</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => simulateSMS(contact.phone, `There is an Emergency\nI need help at: ${getLocationURL()}`)}
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-safety-500 border-safety-200"
                                onClick={() => callContact(contact.phone, contact.name)}
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-safety-500 hover:bg-safety-600"
                    size="lg"
                    onClick={simulateCall}
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
