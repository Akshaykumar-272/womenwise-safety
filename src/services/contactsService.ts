
// Service for handling emergency contacts
import { supabase } from './supabaseService';

export interface Contact {
  id: number;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  isFixed?: boolean;
}

// The fixed emergency contacts that must receive alerts
export const FIXED_EMERGENCY_CONTACTS: Contact[] = [
  { id: 101, name: "Yaswanth", relation: "Emergency", phone: "+91 9391414022", isFixed: true },
  { id: 102, name: "Akshay", relation: "Emergency", phone: "+91 8019735081", isFixed: true },
];

// Get all emergency contacts (from localStorage or Supabase in the future)
export const getEmergencyContacts = (): Contact[] => {
  try {
    // Try to get contacts from localStorage
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      const parsedContacts = JSON.parse(savedContacts) as Contact[];
      return parsedContacts;
    }
  } catch (error) {
    console.error("Error getting emergency contacts:", error);
  }
  
  // Return empty array if no contacts found
  return [];
};

// Save emergency contacts
export const saveEmergencyContacts = (contacts: Contact[]): void => {
  try {
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
  } catch (error) {
    console.error("Error saving emergency contacts:", error);
  }
};

// Add a new emergency contact
export const addEmergencyContact = (contact: Omit<Contact, 'id'>): Contact => {
  const contacts = getEmergencyContacts();
  const newContact = {
    ...contact,
    id: Date.now(), // Use timestamp as ID
  };
  
  saveEmergencyContacts([...contacts, newContact]);
  return newContact;
};

// Update an existing emergency contact
export const updateEmergencyContact = (contact: Contact): boolean => {
  const contacts = getEmergencyContacts();
  const index = contacts.findIndex(c => c.id === contact.id);
  
  if (index === -1) return false;
  
  contacts[index] = contact;
  saveEmergencyContacts(contacts);
  return true;
};

// Remove an emergency contact
export const removeEmergencyContact = (id: number): boolean => {
  const contacts = getEmergencyContacts();
  const filteredContacts = contacts.filter(contact => contact.id !== id);
  
  if (filteredContacts.length === contacts.length) return false;
  
  saveEmergencyContacts(filteredContacts);
  return true;
};

// Get all contacts who should receive emergency alerts
export const getSOSRecipients = (): Contact[] => {
  // Combine fixed contacts with saved contacts
  const savedContacts = getEmergencyContacts();
  
  // Create a map to ensure no duplicates by phone number
  const recipientsMap = new Map<string, Contact>();
  
  // Add fixed contacts first
  FIXED_EMERGENCY_CONTACTS.forEach(contact => {
    recipientsMap.set(contact.phone, contact);
  });
  
  // Add saved contacts
  savedContacts.forEach(contact => {
    // Only add if not already in map (fixed contacts take precedence)
    if (!recipientsMap.has(contact.phone)) {
      recipientsMap.set(contact.phone, contact);
    }
  });
  
  // Convert map values to array
  return Array.from(recipientsMap.values());
};
