
// Service for handling emergency media capture
import { optimizeImage, uploadMedia } from './supabaseService';

// Capture a single image from camera
export const captureImage = async (
  videoElement: HTMLVideoElement
): Promise<Blob | null> => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/jpeg',
        0.85 // Quality parameter
      );
    });
  } catch (error) {
    console.error('Error capturing image:', error);
    return null;
  }
};

// Initialize the camera and return a stream and video element
export const initializeCamera = async (
  facingMode: 'user' | 'environment' = 'environment'
): Promise<{ stream: MediaStream; videoElement: HTMLVideoElement } | null> => {
  try {
    // First, check if we have media permissions
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission status:', permissionStatus.state);
    } catch (error) {
      console.log('Permission API not supported, proceeding anyway');
    }
    
    // Mobile-friendly constraints
    const constraints = {
      video: {
        facingMode,
        width: { ideal: 640 }, // Lower resolution for mobile
        height: { ideal: 480 },
      },
      audio: true, // Enable audio for video recording
    };
    
    console.log('Requesting media with constraints:', constraints);
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log('Media stream obtained successfully');
    
    // Create a video element to display the stream
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.playsInline = true; // Important for iOS
    videoElement.muted = true;
    
    // Wait for the video to be ready
    await new Promise<void>((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play()
          .then(() => {
            console.log('Video playback started');
            resolve();
          })
          .catch(err => {
            console.error('Error starting video playback:', err);
            resolve(); // Still resolve to continue the process
          });
      };
    });
    
    return { stream, videoElement };
  } catch (error) {
    console.error('Error initializing camera:', error);
    return null;
  }
};

// Capture multiple images with delay
export const captureMultipleImages = async (
  videoElement: HTMLVideoElement,
  count: number = 4,
  delayMs: number = 1000
): Promise<Blob[]> => {
  const images: Blob[] = [];
  
  for (let i = 0; i < count; i++) {
    try {
      // Wait for the specified delay
      await new Promise(resolve => setTimeout(resolve, i === 0 ? 0 : delayMs));
      
      console.log(`Capturing image ${i+1}/${count}`);
      const imageBlob = await captureImage(videoElement);
      if (imageBlob) {
        // Optimize image to reduce size
        const optimizedImage = await optimizeImage(imageBlob);
        images.push(optimizedImage);
        console.log(`Image ${i+1} captured successfully`);
      }
    } catch (err) {
      console.error(`Error capturing image ${i+1}:`, err);
    }
  }
  
  console.log(`Captured ${images.length}/${count} images`);
  return images;
};

// Record video from the camera
export const recordVideo = async (
  stream: MediaStream,
  durationMs: number = 10000
): Promise<Blob | null> => {
  console.log(`Starting video recording for ${durationMs}ms`);
  
  return new Promise((resolve) => {
    try {
      // Try to use a more widely supported MIME type for mobile
      let mimeType = 'video/webm';
      
      // Check if the browser supports various MIME types
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      }
      
      console.log(`Using MIME type: ${mimeType}`);
      
      const mediaRecorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 1000000 // Lower bitrate for mobile
      });
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          console.log(`Video data chunk received: ${e.data.size} bytes`);
        }
      };
      
      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped');
        const blob = new Blob(chunks, { type: mimeType });
        console.log(`Video blob created: ${blob.size} bytes`);
        resolve(blob);
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        resolve(null);
      };
      
      mediaRecorder.start(1000); // Record in 1-second chunks
      console.log('MediaRecorder started');
      
      // Stop recording after specified duration
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') {
          console.log('Stopping MediaRecorder after timeout');
          mediaRecorder.stop();
        }
      }, durationMs);
    } catch (error) {
      console.error('Error in recordVideo:', error);
      resolve(null);
    }
  });
};

// Upload multiple media files to Supabase
export const uploadEmergencyMedia = async (
  media: { type: 'image' | 'video'; blob: Blob }[]
): Promise<string[]> => {
  console.log(`Uploading ${media.length} media files to Supabase`);
  
  const uploadPromises = media.map(async (item, index) => {
    try {
      const extension = item.type === 'image' ? 'jpg' : 'webm';
      const timestamp = new Date().getTime();
      const fileName = `emergency-${item.type}-${timestamp}-${index}.${extension}`;
      
      // Convert blob to file with name
      const file = new File([item.blob], fileName, { 
        type: item.type === 'image' ? 'image/jpeg' : 'video/webm' 
      });
      
      console.log(`Uploading ${item.type} (${file.size} bytes) as ${fileName}`);
      
      // Upload to Supabase
      const url = await uploadMedia(file, 'emergency-media', fileName);
      console.log(`Upload complete for ${fileName}: ${url || 'upload failed'}`);
      return url;
    } catch (error) {
      console.error(`Error uploading ${item.type}:`, error);
      return null;
    }
  });
  
  const urls = await Promise.all(uploadPromises);
  const validUrls = urls.filter(Boolean) as string[];
  console.log(`Successfully uploaded ${validUrls.length}/${media.length} media files`);
  
  return validUrls;
};

// Stop all tracks in a media stream
export const stopMediaStream = (stream: MediaStream | null): void => {
  if (!stream) return;
  
  console.log('Stopping media stream tracks');
  stream.getTracks().forEach(track => {
    track.stop();
    console.log(`Track ${track.kind} stopped`);
  });
};

