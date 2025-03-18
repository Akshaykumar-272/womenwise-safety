
import { UserCircle, Plus, Phone, UserRound, ShieldCheck } from 'lucide-react';
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
    </Card>
  );
};

export default TrustedContacts;
