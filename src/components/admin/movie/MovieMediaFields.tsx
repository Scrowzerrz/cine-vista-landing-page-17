
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import ControlledImageUpload from '../ControlledImageUpload';
import ControlledVideoUpload from '../ControlledVideoUpload';

interface MovieFormData {
  title: string;
  originalTitle?: string;
  year: string;
  duration: string;
  rating: string;
  quality: string;
  plot: string;
  poster: File | string | null;
  backdrop: File | string | null;
  playerUrl: File | string | null;
  actors?: string[];
  directors?: string[];
  producers?: string[];
  categories?: string[];
}

interface MovieMediaFieldsProps {
  form: UseFormReturn<MovieFormData>;
}

const MovieMediaFields: React.FC<MovieMediaFieldsProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="poster"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Poster *</FormLabel>
              <FormControl>
                <ControlledImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  className="h-48 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backdrop"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Backdrop *</FormLabel>
              <FormControl>
                <ControlledImageUpload
                  value={field.value}
                  onChange={field.onChange}
                  className="h-48 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="playerUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Vídeo do Filme *</FormLabel>
            <FormControl>
              <ControlledVideoUpload
                value={field.value}
                onChange={field.onChange}
                className="h-auto w-full min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MovieMediaFields;
