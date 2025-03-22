
import { useState, useEffect } from 'react';
import { UserCircle, Plus, Phone, ShieldCheck, MessageSquare, X, Edit, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  getEmergencyContacts, 
  addEmergencyContact,
  removeEmergencyContact,
  Contact,
  FIXED_EMERGENCY_CONTACTS 
} from '@/services/contactsService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TrustedContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [fixedContacts, setFixedContacts] = useState<Contact[]>(FIXED_EMERGENCY_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relation: '',
    email: ''
  });
  const { toast } = useToast();

  // Load contacts when component mounts
  useEffect(() => {
    loadContacts();
    
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

  const loadContacts = () => {
    const savedContacts = getEmergencyContacts();
    setContacts(savedContacts);
  };

  const handleAddContact = () => {
    // Show edit modal with empty contact
    setNewContact({
      name: '',
      phone: '',
      relation: '',
      email: ''
    });
    setShowEditModal(true);
  };

  const handleSaveContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Name and phone number are required",
        variant: "destructive"
      });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!phoneRegex.test(newContact.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    // Validate email if provided
    if (newContact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Add the new contact
    addEmergencyContact({
      name: newContact.name,
      phone: newContact.phone,
      relation: newContact.relation || 'Emergency',
      email: newContact.email
    });

    // Reload contacts and close modal
    loadContacts();
    setShowEditModal(false);
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added to your emergency contacts`,
    });
  };

  const handleCallContact = (contact: Contact) => {
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
    removeEmergencyContact(id);
    loadContacts();
    
    toast({
      title: "Contact Removed",
      description: "Contact has been removed from your emergency contacts",
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
        
        {/* Fixed Contacts Section */}
        {fixedContacts.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">Fixed Emergency Contacts</p>
            <div className="space-y-3">
              {fixedContacts.map((contact) => (
                <div key={contact.id} className="animate-fade-in">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border bg-alert-100">
                        <AvatarFallback className="bg-alert-100 text-alert-700">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-5 bg-alert-50 text-alert-700 border-alert-200">
                            Fixed
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
                    </div>
                  </div>
                  
                  {contact.id !== fixedContacts[fixedContacts.length - 1].id && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
            
            {contacts.length > 0 && <Separator className="mt-4 mb-4" />}
          </div>
        )}
        
        <div className="space-y-4">
          {contacts.length > 0 ? (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Your Emergency Contacts</p>
              {contacts.map((contact) => (
                <div key={contact.id} className="animate-fade-in">
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-border">
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
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {contact.id !== contacts[contacts.length - 1].id && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <UserRound className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">No emergency contacts added yet</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddContact}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Contact
              </Button>
            </div>
          )}
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
      
      {/* Add/Edit Contact Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-lg">Add Emergency Contact</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowEditModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  type="text" 
                  placeholder="Contact name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input 
                  type="tel" 
                  placeholder="Phone number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Include country code (e.g. +1 for US)</p>
              </div>
              
              <div className="space-y-2">
                <Label>Relation</Label>
                <Input 
                  type="text" 
                  placeholder="E.g. Friend, Family"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input 
                  type="email" 
                  placeholder="For backup notifications"
                  value={newContact.email}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Used as backup if SMS fails</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-safety-500 hover:bg-safety-600"
                onClick={handleSaveContact}
              >
                Save Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TrustedContacts;
