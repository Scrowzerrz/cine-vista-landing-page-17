
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface MovieBasicFieldsProps {
  form: UseFormReturn<MovieFormData>;
}

const MovieBasicFields: React.FC<MovieBasicFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Título *</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Nome do filme"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="originalTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Título Original</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Título original (se diferente)"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Ano *</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="2024"
                type="number"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Duração *</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="120 min"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Classificação *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a classificação" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="L">Livre</SelectItem>
                <SelectItem value="10">10 anos</SelectItem>
                <SelectItem value="12">12 anos</SelectItem>
                <SelectItem value="14">14 anos</SelectItem>
                <SelectItem value="16">16 anos</SelectItem>
                <SelectItem value="18">18 anos</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="quality"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Qualidade *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Selecione a qualidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="HD">HD</SelectItem>
                <SelectItem value="Full HD">Full HD</SelectItem>
                <SelectItem value="4K">4K</SelectItem>
                <SelectItem value="8K">8K</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="plot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Sinopse *</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Descrição do filme..."
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default MovieBasicFields;
