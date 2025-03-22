
// Supabase service for handling storage and SMS functionality
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - replace with your own Supabase URL and key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a mock client if credentials are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials are missing. Using mock implementation.');
    // Return a mock implementation that doesn't throw errors
    return {
      storage: {
        from: () => ({
          upload: async () => {
            console.log('Mock upload called');
            return { data: { path: 'mock-path' }, error: null };
          },
          getPublicUrl: () => {
            console.log('Mock getPublicUrl called');
            return { data: { publicUrl: 'https://example.com/mock-image.jpg' } };
          },
        }),
      },
      functions: {
        invoke: async (name: string, options: any) => {
          console.log(`Mock function ${name} invoked with:`, options.body);
          return { data: { success: true }, error: null };
        },
      },
    };
  }
  
  // Return the real Supabase client if credentials exist
  return createClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();

// Upload media to Supabase storage
export const uploadMedia = async (
  file: File | Blob,
  bucket: string = 'emergency-media',
  fileName: string,
): Promise<string | null> => {
  try {
    // Create a unique filename with timestamp
    const timestamp = new Date().getTime();
    const uniqueFileName = `${fileName}-${timestamp}`;
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, file);
      
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadMedia:', error);
    return null;
  }
};

// Function to send SMS via Supabase Edge Function
export const sendEmergencySMS = async (
  phone: string,
  message: string,
  mediaUrls: string[],
): Promise<boolean> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured. SMS would be sent to:', phone);
      console.log('Message content:', message);
      console.log('Media URLs:', mediaUrls);
      
      // Generate a mock public URL if we're in development mode
      if (mediaUrls.length === 0) {
        mediaUrls = ['https://example.com/mock-emergency-image.jpg'];
      }
      
      // In development, try to use the device's native SMS capability
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        const mediaLinks = mediaUrls.map(url => `\n${url}`).join('');
        const fullMessage = `${message}\n\nEmergency Media:${mediaLinks}`;
        const encodedMessage = encodeURIComponent(fullMessage);
        window.location.href = `sms:${phone}?body=${encodedMessage}`;
      }
      
      return true; // Return success in development to allow testing
    }
    
    // Call Supabase Edge Function to send SMS
    const { data, error } = await supabase.functions.invoke('send-emergency-sms', {
      body: {
        phone,
        message,
        mediaUrls,
      },
    });
    
    if (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Error in sendEmergencySMS:', error);
    return false;
  }
};

// Fallback: Send emergency email if SMS fails
export const sendEmergencyEmail = async (
  email: string,
  subject: string,
  message: string,
  mediaUrls: string[],
): Promise<boolean> => {
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured. Email would be sent to:', email);
      console.log('Subject:', subject);
      console.log('Message content:', message);
      console.log('Media URLs:', mediaUrls);
      
      // In development, try to use the device's native email capability
      const mediaLinks = mediaUrls.map(url => `\n${url}`).join('');
      const fullMessage = `${message}\n\nEmergency Media:${mediaLinks}`;
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(fullMessage);
      window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
      
      return true; // Return success in development to allow testing
    }
    
    // Call Supabase Edge Function to send email
    const { data, error } = await supabase.functions.invoke('send-emergency-email', {
      body: {
        email,
        subject,
        message,
        mediaUrls,
      },
    });
    
    if (error) {
      console.error('Error sending email:', error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error('Error in sendEmergencyEmail:', error);
    return false;
  }
};

// Optimize image before upload (resize to reduce size for faster upload)
export const optimizeImage = async (imageBlob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(imageBlob);
    
    img.onload = () => {
      // Target width to reduce file size while maintaining quality
      const MAX_WIDTH = 800;
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions to maintain aspect ratio
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to Blob with reduced quality
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        0.7 // Reduced quality to decrease file size
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};

