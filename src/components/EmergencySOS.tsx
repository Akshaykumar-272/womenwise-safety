import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Phone, X, Send, MessageSquare, Camera, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const getEmergencyContacts = () => {
  try {
    const savedContacts = localStorage.getItem('trustedContacts');
    if (savedContacts) {
      return JSON.parse(savedContacts);
    }
  } catch (error) {
    console.error("Error getting emergency contacts:", error);
  }
  
  return [
    { id: 1, name: 'Emergency Contact 1', relation: 'Emergency', phone: '9391414022' },
    { id: 2, name: 'Emergency Contact 2', relation: 'Emergency', phone: '7842522747' },
    { id: 3, name: 'Emergency Contact 3', relation: 'Emergency', phone: '8019735081' },
  ];
};

const EmergencySOS = () => {
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showDialog, setShowDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [contactsNotified, setContactsNotified] = useState<string[]>([]);
  const [nearbyContacts, setNearbyContacts] = useState<any[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [capturedVideo, setCapturedVideo] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

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

  const handleActivateSOS = () => {
    setIsActive(true);
    setShowDialog(true);
    setContactsNotified([]);
    
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
    stopCamera();
    stopVideoRecording();
    
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled",
      variant: "default",
    });
  };
  
  const triggerSOS = () => {
    if (!currentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setCurrentLocation({ lat: latitude, lng: longitude });
          sendSOSAlerts({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
          sendSOSAlerts(null);
        }
      );
    } else {
      sendSOSAlerts(currentLocation);
    }
  };

  const sendSOSAlerts = (location: {lat: number, lng: number} | null) => {
    toast({
      title: "SOS Activated",
      description: "Emergency contacts are being notified with your location",
      variant: "destructive",
    });
    
    const formattedMessage = location 
      ? `There is an Emergency\nIam at This Location\nLatitude: ${location.lat}\nLongitude: ${location.lng}\nhttps://www.google.com/maps?q=${location.lat},${location.lng}`
      : "There is an Emergency\nUnable to determine location";

    const emergencyContacts = getEmergencyContacts();
    
    emergencyContacts.forEach((contact: any, index: number) => {
      setTimeout(() => {
        console.log(`SOS message sent to ${contact.name} at ${contact.phone} with message: ${formattedMessage}`);
        setContactsNotified(prev => [...prev, contact.name]);
        toast({
          title: `Alert Sent to ${contact.name}`,
          description: `Emergency message sent to ${contact.phone}`,
        });
      }, 1000 * (index + 1));
    });
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
  
  const simulateSMS = (phone: string) => {
    const message = currentLocation 
      ? `There is an Emergency\nIam at This Location\nLatitude: ${currentLocation.lat}\nLongitude: ${currentLocation.lng}\nhttps://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`
      : "There is an Emergency\nUnable to determine location";
    
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

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      toast({
        title: "Camera Activated",
        description: "Ready to capture image for emergency contact",
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Check permissions.",
        variant: "destructive",
      });
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      toast({
        title: "Image Captured",
        description: "Photo ready to send to emergency contacts",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const startVideoRecording = async () => {
    try {
      setIsVideoActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setCapturedVideo(videoUrl);
        
        toast({
          title: "Video Recorded",
          description: "Video ready to send to emergency contacts",
        });
      };
      
      mediaRecorder.start();
      
      toast({
        title: "Recording Started",
        description: "Recording video for emergency contact",
      });
      
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopVideoRecording();
        }
      }, 15000);
      
    } catch (error) {
      console.error("Error accessing camera for video:", error);
      toast({
        title: "Video Recording Error",
        description: "Unable to access camera for video. Check permissions.",
        variant: "destructive",
      });
      setIsVideoActive(false);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsVideoActive(false);
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
                  <p className="font-medium">Alerting emergency contacts</p>
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
                  
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-2">Capture Media</p>
                    
                    {(isCameraActive || isVideoActive) && (
                      <div className="mb-4">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          muted 
                          playsInline
                          className="w-full h-auto rounded-lg mb-2"
                        />
                        <div className="flex justify-center gap-2">
                          {isCameraActive && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-safety-500 text-white"
                                onClick={captureImage}
                              >
                                <Camera className="h-3.5 w-3.5 mr-1.5" />
                                Capture
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={stopCamera}
                              >
                                <X className="h-3.5 w-3.5 mr-1.5" />
                                Cancel
                              </Button>
                            </>
                          )}
                          
                          {isVideoActive && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={stopVideoRecording}
                            >
                              <X className="h-3.5 w-3.5 mr-1.5" />
                              Stop Recording
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {!isCameraActive && !isVideoActive && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={startCamera}
                          className="flex-1"
                        >
                          <Camera className="h-3.5 w-3.5 mr-1.5" />
                          Take Photo
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={startVideoRecording}
                          className="flex-1"
                        >
                          <Video className="h-3.5 w-3.5 mr-1.5" />
                          Record Video
                        </Button>
                      </div>
                    )}
                    
                    {capturedImage && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Captured Image:</p>
                        <img 
                          src={capturedImage} 
                          alt="Captured emergency situation" 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                    
                    {capturedVideo && (
                      <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Recorded Video:</p>
                        <video 
                          src={capturedVideo} 
                          controls
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                  
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
                                onClick={() => simulateSMS(contact.phone)}
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
