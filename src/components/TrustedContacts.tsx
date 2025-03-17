
import { UserCircle, Plus, Phone, UserRound, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Initial sample contacts
const initialContacts = [
  { id: 1, name: 'Emma Wilson', relation: 'Sister', phone: '+1 234 567 8901', image: '' },
  { id: 2, name: 'Michael Chen', relation: 'Friend', phone: '+1 234 567 8902', image: '' },
  { id: 3, name: 'Sarah Johnson', relation: 'Mother', phone: '+1 234 567 8903', image: '' },
];

const TrustedContacts = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const { toast } = useToast();

  const handleAddContact = () => {
    // This would normally open a modal, but for simplicity we'll just add a sample contact
    const newContact = {
      id: contacts.length + 1,
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

  const handleCallContact = (contact: typeof contacts[0]) => {
    toast({
      title: "Calling Contact",
      description: `Calling ${contact.name} at ${contact.phone}`,
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
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-safety-500"
                  onClick={() => handleCallContact(contact)}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
              
              {contact.id !== contacts.length && (
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
