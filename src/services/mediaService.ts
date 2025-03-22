
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
    const constraints = {
      video: {
        facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Create a video element to display the stream
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.playsInline = true;
    videoElement.muted = true;
    
    // Wait for the video to be ready
    await new Promise<void>((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play().then(() => resolve());
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
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, i === 0 ? 0 : delayMs));
    
    const imageBlob = await captureImage(videoElement);
    if (imageBlob) {
      // Optimize image to reduce size
      const optimizedImage = await optimizeImage(imageBlob);
      images.push(optimizedImage);
    }
  }
  
  return images;
};

// Record video from the camera
export const recordVideo = async (
  stream: MediaStream,
  durationMs: number = 10000
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const mediaRecorder = new MediaRecorder(stream, { 
      mimeType: 'video/webm;codecs=vp9,opus' 
    });
    
    const chunks: BlobPart[] = [];
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
    
    mediaRecorder.start();
    
    // Stop recording after specified duration
    setTimeout(() => {
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    }, durationMs);
  });
};

// Upload multiple media files to Supabase
export const uploadEmergencyMedia = async (
  media: { type: 'image' | 'video'; blob: Blob }[]
): Promise<string[]> => {
  const uploadPromises = media.map(async (item, index) => {
    const extension = item.type === 'image' ? 'jpg' : 'webm';
    const fileName = `emergency-${item.type}-${index}.${extension}`;
    
    // Convert blob to file with name
    const file = new File([item.blob], fileName, { 
      type: item.type === 'image' ? 'image/jpeg' : 'video/webm' 
    });
    
    // Upload to Supabase
    const url = await uploadMedia(file, 'emergency-media', fileName);
    return url;
  });
  
  const urls = await Promise.all(uploadPromises);
  return urls.filter(Boolean) as string[];
};

// Stop all tracks in a media stream
export const stopMediaStream = (stream: MediaStream | null): void => {
  if (!stream) return;
  
  stream.getTracks().forEach(track => {
    track.stop();
  });
};
