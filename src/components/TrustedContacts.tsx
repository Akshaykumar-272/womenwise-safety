
import { UserCircle, Plus, Phone, UserRound, ShieldCheck, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Initial sample contacts - in a real app, these would come from a database
const initialContacts = [
  { id: 1, name: 'Emma Wilson', relation: 'Sister', phone: '+1 234 567 8901', image: '' },
  { id: 2, name: 'Michael Chen', relation: 'Friend', phone: '+1 234 567 8902', image: '' },
  { id: 3, name: 'Sarah Johnson', relation: 'Mother', phone: '+1 234 567 8903', image: '' },
];

interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
  image: string;
}

const TrustedContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  // This would normally fetch contacts from a backend API
  useEffect(() => {
    // Simulate loading contacts from storage/backend
    const savedContacts = localStorage.getItem('trustedContacts');
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (error) {
        console.error("Error parsing saved contacts:", error);
      }
    }
    
    // Get current location for emergency messages
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
  }, []);

  // Save contacts to localStorage when they change (simulating a backend)
  useEffect(() => {
    localStorage.setItem('trustedContacts', JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = () => {
    // In a real app with a backend, this would make an API call
    const newContact = {
      id: Date.now(),
      name: 'New Contact',
      relation: 'Friend',
      phone: '+1 234 567 8904',
      image: ''
    };
    
    setContacts([...contacts, newContact]);
    toast({
      title: "Contact Added",
      description: "New emergency contact has been added",
    });
  };

  const handleCallContact = (contact: Contact) => {
    // In a real app, this would initiate a call or send a message
    toast({
      title: "Calling Contact",
      description: `Calling ${contact.name} at ${contact.phone}`,
    });
    
    // Simulate a call
    setTimeout(() => {
      window.location.href = `tel:${contact.phone.replace(/\s+/g, '')}`;
    }, 1000);
  };

  const handleSendSMS = (contact: Contact) => {
    setSelectedContact(contact);
    setSmsMessage(`EMERGENCY ALERT: I need help! `);
    
    if (currentLocation) {
      setSmsMessage(prev => `${prev}My location: https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`);
    }
    
    setShowSmsModal(true);
  };

  const sendSMS = () => {
    if (!selectedContact) return;
    
    toast({
      title: "SMS Alert Sent",
      description: `Emergency message sent to ${selectedContact.name}`,
    });
    
    // In a real app with a backend, this would make an API call to send the SMS
    console.log(`SMS sent to ${selectedContact.name} at ${selectedContact.phone}: ${smsMessage}`);
    
    // On mobile devices, this opens the SMS app
    const encodedMessage = encodeURIComponent(smsMessage);
    window.location.href = `sms:${selectedContact.phone.replace(/\s+/g, '')}?body=${encodedMessage}`;
    
    setShowSmsModal(false);
  };

  const handleRemoveContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Contact has been removed from your trusted contacts",
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-safety-500" />
            Trusted Contacts
          </h3>
          <Button variant="outline" size="sm" className="h-8" onClick={handleAddContact}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add New
          </Button>
        </div>
        
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="animate-fade-in" style={{ animationDelay: `${contact.id * 100}ms` }}>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={contact.image} alt={contact.name} />
                    <AvatarFallback className="bg-safety-100 text-safety-700">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5">
                        {contact.relation}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-safety-500"
                    onClick={() => handleCallContact(contact)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-safety-500"
                    onClick={() => handleSendSMS(contact)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground"
                    onClick={() => handleRemoveContact(contact.id)}
                  >
                    <UserCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {contact.id !== contacts[contacts.length - 1].id && (
                <Separator className="my-3" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-muted/30 p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          These contacts will be notified when you activate the SOS feature
        </p>
      </div>
      
      {/* SMS Modal */}
      {showSmsModal && selectedContact && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Send Emergency Alert</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSmsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">To: {selectedContact.name}</p>
                <p className="text-sm font-medium">{selectedContact.phone}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Emergency Message</label>
                <textarea
                  className="w-full border border-input min-h-24 rounded-md p-3 text-sm"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowSmsModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-alert-500 hover:bg-alert-600"
                onClick={sendSMS}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Alert
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TrustedContacts;
