
import { supabase } from '@/integrations/supabase/client';

export const uploadTaskImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  console.log('Uploading image:', fileName);
  
  const { data, error } = await supabase.storage
    .from('task-images')
    .upload(fileName, file);
  
  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('task-images')
    .getPublicUrl(fileName);
  
  console.log('Image uploaded successfully:', publicUrl);
  return publicUrl;
};

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  
  const { data: { publicUrl } } = supabase.storage
    .from('task-images')
    .getPublicUrl(imagePath);
  
  return publicUrl;
};
