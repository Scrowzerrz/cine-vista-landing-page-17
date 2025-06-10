
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TVShowFormData {
  title: string;
  originalTitle?: string;
  year: string;
  rating: string;
  quality: string;
  plot: string;
  poster: string;
  backdrop: string;
  network?: string;
  creator?: string;
}

interface TVShowBasicFieldsProps {
  form: UseFormReturn<TVShowFormData>;
}

const TVShowBasicFields: React.FC<TVShowBasicFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Informações Básicas</h3>
      
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
                  placeholder="Nome da série"
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

        <FormField
          control={form.control}
          name="network"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Rede/Canal</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Netflix, HBO, etc."
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creator"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Criador</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Nome do criador"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="plot"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Sinopse *</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Descrição da série..."
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
    </div>
  );
};

export default TVShowBasicFields;
