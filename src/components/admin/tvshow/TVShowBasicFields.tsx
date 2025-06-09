
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import type { TVShowFormData } from '../TVShowUpload';

interface TVShowBasicFieldsProps {
  form: UseFormReturn<TVShowFormData>;
}

const TVShowBasicFields: React.FC<TVShowBasicFieldsProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Título *</FormLabel>
              <FormControl>
                <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
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
                <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
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
                <Input {...field} type="number" className="bg-gray-800 border-gray-600 text-white" />
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
              <FormControl>
                <Input {...field} placeholder="ex: 8.5" className="bg-gray-800 border-gray-600 text-white" />
              </FormControl>
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
              <FormControl>
                <Input {...field} placeholder="ex: HD, 4K" className="bg-gray-800 border-gray-600 text-white" />
              </FormControl>
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
                <Input {...field} placeholder="ex: Netflix, HBO" className="bg-gray-800 border-gray-600 text-white" />
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
                <Input {...field} className="bg-gray-800 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalSeasons"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Total de Temporadas *</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1" onChange={e => field.onChange(parseInt(e.target.value))} className="bg-gray-800 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalEpisodes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Total de Episódios *</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="1" onChange={e => field.onChange(parseInt(e.target.value))} className="bg-gray-800 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="poster"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">URL do Poster *</FormLabel>
              <FormControl>
                <Input {...field} type="url" placeholder="https://..." className="bg-gray-800 border-gray-600 text-white" />
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
                <Input {...field} type="url" placeholder="https://..." className="bg-gray-800 border-gray-600 text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="plot"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white">Sinopse *</FormLabel>
            <FormControl>
              <Textarea {...field} rows={4} className="bg-gray-800 border-gray-600 text-white" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default TVShowBasicFields;
