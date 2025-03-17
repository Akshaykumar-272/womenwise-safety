
import { useEffect, useState } from 'react';
import { ArrowLeft, UserPlus, User, X, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import TrustedContacts from '@/components/TrustedContacts';
import { useIsMobile } from '@/hooks/use-mobile';

const Contacts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    toast({
      title: "Trusted Contacts",
      description: "Manage your emergency contacts",
    });
  }, [toast]);

  // Mock data for demonstration
  const mockContacts = [
    { id: 1, name: "Jane Smith", relation: "Sister", phone: "+1 234-567-8901" },
    { id: 2, name: "Mark Johnson", relation: "Friend", phone: "+1 234-567-8902" },
    { id: 3, name: "Sarah Williams", relation: "Mother", phone: "+1 234-567-8903" },
  ];

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
            
            <div className="space-y-4">
              {mockContacts.map(contact => (
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
                      <p className="text-sm text-muted-foreground">{contact.relation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-safety-500">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
                
                <Button className="w-full bg-safety-500 hover:bg-safety-600">
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
                <label className="text-sm font-medium">Name</label>
                <input 
                  type="text" 
                  placeholder="Contact name" 
                  className="w-full border border-input rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-safety-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Phone number" 
                  className="w-full border border-input rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-safety-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Relation</label>
                <input 
                  type="text" 
                  placeholder="E.g. Friend, Family" 
                  className="w-full border border-input rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-safety-500"
                />
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
                onClick={() => {
                  toast({
                    title: "Contact Added",
                    description: "New emergency contact has been added",
                  });
                  setShowAddContact(false);
                }}
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
