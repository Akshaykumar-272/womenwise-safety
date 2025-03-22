
// Supabase service for handling storage and SMS functionality
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client - replace with your own Supabase URL and key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a mock client if credentials are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials are missing. Using mock implementation.');
    
    // Storage for mock uploaded files
    const mockStorage = {
      files: new Map(),
      nextId: 1
    };
    
    // Return a mock implementation that doesn't throw errors
    return {
      storage: {
        from: (bucket: string) => ({
          upload: async (path: string, file: File | Blob) => {
            console.log(`Mock upload called for bucket: ${bucket}, path: ${path}, file size: ${file.size} bytes`);
            
            try {
              // Generate a unique ID for the file
              const fileId = mockStorage.nextId++;
              const fileExtension = path.split('.').pop() || '';
              const mimeType = fileExtension === 'jpg' ? 'image/jpeg' : 'video/mp4';
              
              // Store the file in our mock storage
              mockStorage.files.set(fileId.toString(), {
                path,
                size: file.size,
                type: mimeType,
                uploadTime: new Date().toISOString()
              });
              
              console.log(`Mock file uploaded with ID: ${fileId}`);
              return { 
                data: { path, id: fileId.toString() }, 
                error: null 
              };
            } catch (error) {
              console.error('Error in mock upload:', error);
              return { data: null, error: 'Upload failed' };
            }
          },
          getPublicUrl: (path: string) => {
            console.log(`Mock getPublicUrl called for path: ${path}`);
            
            // Extract file ID from path if present
            const fileIdMatch = path.match(/\-(\d+)$/);
            const fileId = fileIdMatch ? fileIdMatch[1] : Math.floor(Math.random() * 10000).toString();
            
            // Generate public URL based on file extension
            const fileExtension = path.split('.').pop()?.toLowerCase() || '';
            const timestamp = new Date().getTime();
            let baseUrl = '';
            
            // Mimic Google Drive-like URLs 
            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
              baseUrl = `https://drive.google.com/uc?export=view&id=img${fileId}`;
            } else if (['mp4', 'webm', 'mov'].includes(fileExtension)) {
              baseUrl = `https://drive.google.com/uc?export=view&id=vid${fileId}`;
            } else {
              baseUrl = `https://drive.google.com/uc?export=view&id=file${fileId}`;
            }
            
            return { 
              data: { 
                publicUrl: `${baseUrl}&t=${timestamp}` 
              } 
            };
          },
        }),
      },
      functions: {
        invoke: async (name: string, options: any) => {
          console.log(`Mock function ${name} invoked with:`, options.body);
          
          // Handle different function names
          if (name === 'send-emergency-sms') {
            const { phone, message, mediaUrls } = options.body;
            console.log(`Would send SMS to ${phone} with message: ${message}`);
            console.log('Media URLs included:', mediaUrls);
            
            // Simulate delay for more realistic behavior
            await new Promise(resolve => setTimeout(resolve, 800));
            
            return { 
              data: { 
                success: true, 
                messageId: `mock-msg-${Date.now()}`,
                sentTo: phone,
                timestamp: new Date().toISOString()
              }, 
              error: null 
            };
          } else if (name === 'send-emergency-email') {
            const { email, subject, message, mediaUrls } = options.body;
            console.log(`Would send email to ${email} with subject: ${subject}`);
            console.log('Email body:', message);
            console.log('Media URLs included:', mediaUrls);
            
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 600));
            
            return { 
              data: { 
                success: true,
                messageId: `mock-email-${Date.now()}`,
                sentTo: email,
                timestamp: new Date().toISOString()
              }, 
              error: null 
            };
          } else if (name === 'upload-to-google-drive') {
            // This would be the future Google Drive upload function
            const { file, fileName, mimeType } = options.body;
            console.log(`Would upload to Google Drive: ${fileName} (${mimeType})`);
            
            // Generate a mock Google Drive file ID
            const mockFileId = `${Math.random().toString(36).substring(2, 12)}`;
            const mockViewUrl = `https://drive.google.com/uc?export=view&id=${mockFileId}`;
            
            return {
              data: {
                success: true,
                fileId: mockFileId,
                viewUrl: mockViewUrl,
                fileName
              },
              error: null
            };
          }
          
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
    
    // Log the upload attempt
    console.log(`Uploading file: ${uniqueFileName} (size: ${file.size} bytes)`);
    
    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(uniqueFileName, file);
      
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    console.log('File uploaded successfully, getting public URL');
    
    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(uniqueFileName);
      
    console.log('Generated public URL:', urlData.publicUrl);
    
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
      
      // Generate more realistic mock media URLs if we're in development mode and none provided
      if (mediaUrls.length === 0) {
        const timestamp = new Date().getTime();
        mediaUrls = [
          `https://drive.google.com/uc?export=view&id=img${timestamp}1`,
          `https://drive.google.com/uc?export=view&id=img${timestamp}2`,
        ];
      }
      
      // In development, try to use the device's native SMS capability
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        // Create a formatted SMS message with media links
        const mediaLinksText = mediaUrls.length > 0 ? "\n\n📸 Emergency Media:" : "";
        const mediaLinks = mediaUrls.map((url, index) => 
          `\n${index + 1}. ${url}`
        ).join('');
        
        const fullMessage = `🚨 EMERGENCY ALERT 🚨\n${message}${mediaLinksText}${mediaLinks}`;
        const encodedMessage = encodeURIComponent(fullMessage);
        
        console.log('Preparing to open SMS app with message:', fullMessage);
        
        // Use a timeout to allow the interface to update before redirecting
        setTimeout(() => {
          // Try to use universal SMS URI scheme first
          window.location.href = `sms:${phone}?body=${encodedMessage}`;
          
          // Fallback for iOS
          setTimeout(() => {
            if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
              window.location.href = `sms:${phone}&body=${encodedMessage}`;
            }
          }, 300);
        }, 800);
      } else {
        console.log('Not on a mobile device, SMS functionality limited');
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
      
      // Generate more realistic mock media URLs if we're in development mode and none provided
      if (mediaUrls.length === 0) {
        const timestamp = new Date().getTime();
        mediaUrls = [
          `https://drive.google.com/uc?export=view&id=img${timestamp}1`,
          `https://drive.google.com/uc?export=view&id=img${timestamp}2`,
        ];
      }
      
      // In development, try to use the device's native email capability
      const mediaLinksText = mediaUrls.length > 0 ? "\n\n📸 Emergency Media:" : "";
      const mediaLinks = mediaUrls.map((url, index) => `\n${index + 1}. ${url}`).join('');
      const fullMessage = `🚨 EMERGENCY ALERT 🚨\n${message}${mediaLinksText}${mediaLinks}`;
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(fullMessage);
      
      // Use a timeout to allow the interface to update before redirecting
      setTimeout(() => {
        window.location.href = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
      }, 800);
      
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

// Future function for Google Drive upload
export const uploadToGoogleDrive = async (
  file: Blob | File,
  fileName: string
): Promise<{success: boolean, fileUrl: string | null}> => {
  try {
    // In a real implementation, this would be handled by a Supabase Edge Function
    // that has access to the Google Drive API credentials
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase not configured. Using mock Google Drive upload.');
      
      // Mock implementation - simulates a Google Drive upload
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
      const fileType = file.type || 
        (fileExtension === 'jpg' || fileExtension === 'jpeg' ? 'image/jpeg' : 
         fileExtension === 'png' ? 'image/png' : 
         fileExtension === 'mp4' ? 'video/mp4' : 'application/octet-stream');
      
      // Generate a mock Google Drive file ID
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 10);
      const mockFileId = `${randomString}${timestamp}`;
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, file.size > 1000000 ? 2000 : 1000));
      
      console.log(`Mock Google Drive upload successful for: ${fileName} (${fileType})`);
      
      // Return a Google Drive-like public URL
      return {
        success: true,
        fileUrl: `https://drive.google.com/uc?export=view&id=${mockFileId}`
      };
    }
    
    // Real implementation would call a Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('upload-to-google-drive', {
      body: {
        file,
        fileName,
        mimeType: file.type
      },
    });
    
    if (error) {
      console.error('Error uploading to Google Drive:', error);
      return { success: false, fileUrl: null };
    }
    
    return {
      success: true,
      fileUrl: data.viewUrl || null
    };
  } catch (error) {
    console.error('Error in uploadToGoogleDrive:', error);
    return { success: false, fileUrl: null };
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

