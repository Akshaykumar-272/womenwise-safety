
import { useEffect, useState } from 'react';
import { ArrowLeft, UserPlus, User, X, Phone, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import TrustedContacts from '@/components/TrustedContacts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  getEmergencyContacts,
  addEmergencyContact,
  removeEmergencyContact,
  Contact,
  FIXED_EMERGENCY_CONTACTS
} from '@/services/contactsService';

const Contacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showAddContact, setShowAddContact] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relation: '',
    email: ''
  });

  useEffect(() => {
    loadContacts();
    
    toast({
      title: "Trusted Contacts",
      description: "Manage your emergency contacts",
    });
  }, [toast]);

  const loadContacts = () => {
    const savedContacts = getEmergencyContacts();
    setContacts(savedContacts);
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relation) {
      toast({
        title: "Missing Information",
        description: "Please fill all contact details",
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

    // Add the new contact
    addEmergencyContact({
      name: newContact.name,
      phone: newContact.phone,
      relation: newContact.relation,
      email: newContact.email
    });

    // Reload contacts and reset form
    loadContacts();
    setNewContact({ name: '', phone: '', relation: '', email: '' });
    setShowAddContact(false);
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added to your trusted contacts`,
    });
  };

  const handleRemoveContact = (id: number) => {
    removeEmergencyContact(id);
    loadContacts();
    
    toast({
      title: "Contact Removed",
      description: "Contact has been removed from your trusted contacts",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-4" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-medium">Trusted Contacts</h1>
          </div>
          
          <Button 
            className="bg-safety-500 hover:bg-safety-600"
            onClick={() => setShowAddContact(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-medium mb-6">Your Emergency Contacts</h2>
            
            {/* Fixed Emergency Contacts */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-alert-500" />
                <h3 className="font-medium">Default SOS Recipients</h3>
              </div>
              
              <div className="space-y-4">
                {FIXED_EMERGENCY_CONTACTS.map(contact => (
                  <div 
                    key={contact.id} 
                    className="flex items-center justify-between p-4 bg-alert-50/50 rounded-lg border border-alert-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-alert-100 h-10 w-10 rounded-full flex items-center justify-center text-alert-500">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-safety-500">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-muted-foreground mt-2 italic">
                These contacts will always receive SOS alerts
              </p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Additional Emergency Contacts</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddContact(true)}
                >
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                  Add Contact
                </Button>
              </div>
              
              {contacts.length === 0 ? (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <User className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-muted-foreground">You haven't added any emergency contacts yet</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setShowAddContact(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Your First Contact
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map(contact => (
                    <div 
                      key={contact.id} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-safety-100 h-10 w-10 rounded-full flex items-center justify-center text-safety-500">
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{contact.relation}</p>
                            {contact.email && (
                              <p className="text-xs text-muted-foreground">({contact.email})</p>
                            )}
                          </div>
                          <p className="text-sm font-medium">{contact.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-safety-500">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-full h-8 w-8"
                          onClick={() => handleRemoveContact(contact.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Your emergency contacts will receive alerts with your location 
                whenever you activate the SOS feature
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-xl font-medium mb-4">Location Sharing</h2>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Share your real-time location with selected contacts for added safety
                </p>
                
                <Button 
                  className="w-full bg-safety-500 hover:bg-safety-600"
                  onClick={() => {
                    toast({
                      title: "Location Shared",
                      description: "Your location has been shared with trusted contacts",
                    });
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Share Location
                </Button>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Auto-share during SOS</span>
                  <div className="w-12 h-6 bg-safety-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            
            <TrustedContacts />
          </div>
        </div>
      </main>
      
      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-medium text-lg">Add Trusted Contact</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowAddContact(false)}>
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
                  value={newContact.email || ''}
                  onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">Used as backup if SMS fails</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setShowAddContact(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-safety-500 hover:bg-safety-600"
                onClick={handleAddContact}
              >
                Add Contact
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
