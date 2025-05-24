
import { supabase } from '@/integrations/supabase/client';

export interface MediaUpload {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_type: 'movie_poster' | 'movie_backdrop' | 'tvshow_poster' | 'tvshow_backdrop' | 'episode_poster';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export async function uploadFile(file: File, uploadType: MediaUpload['upload_type']) {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${uploadType}_${Date.now()}.${fileExt}`;
    const filePath = `${uploadType}/${fileName}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media-uploads')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Save metadata to database
    const { data: dbData, error: dbError } = await supabase
      .from('media_uploads')
      .insert({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        upload_type: uploadType,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      // If database insert fails, remove the uploaded file
      await supabase.storage.from('media-uploads').remove([filePath]);
      throw dbError;
    }

    return dbData;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export async function getAllUploads(): Promise<MediaUpload[]> {
  const { data, error } = await supabase
    .from('media_uploads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching uploads:', error);
    return [];
  }

  return data || [];
}

export async function updateUploadStatus(id: string, status: MediaUpload['status']) {
  const { data, error } = await supabase
    .from('media_uploads')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteUpload(id: string, filePath: string) {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('media-uploads')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('media_uploads')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw dbError;
    }

    return true;
  } catch (error) {
    console.error('Error deleting upload:', error);
    throw error;
  }
}

export function getFileUrl(filePath: string): string {
  const { data } = supabase.storage
    .from('media-uploads')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
