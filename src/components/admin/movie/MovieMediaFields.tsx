
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface MovieFormData {
  title: string;
  originalTitle?: string;
  year: string;
  duration: string;
  rating: string;
  quality: string;
  plot: string;
  poster: string;
  backdrop: string;
  playerUrl: string;
}

interface MovieMediaFieldsProps {
  form: UseFormReturn<MovieFormData>;
}

const MovieMediaFields: React.FC<MovieMediaFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Imagens</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="poster"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">URL do Poster *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://exemplo.com/poster.jpg"
                  type="url"
                  className="bg-gray-700 border-gray-600 text-white"
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
              <FormLabel className="text-white">URL do Backdrop *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="https://exemplo.com/backdrop.jpg"
                  type="url"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {form.watch('poster') && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-2">Preview do Poster:</p>
          <img 
            src={form.watch('poster')} 
            alt="Preview do poster" 
            className="w-32 h-48 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MovieMediaFields;
