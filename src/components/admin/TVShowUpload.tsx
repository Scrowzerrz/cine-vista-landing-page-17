
import React, { useState } from 'react';
import { Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TVShowBasicFields from './tvshow/TVShowBasicFields';
import TVShowPersonnelFields from './tvshow/TVShowPersonnelFields';
import { useTVShowSubmit } from './tvshow/useTVShowSubmit';

const tvshowSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  originalTitle: z.string().optional(),
  year: z.string().min(4, 'Ano deve ter 4 dígitos'),
  rating: z.string().min(1, 'Classificação é obrigatória'),
  quality: z.string().min(1, 'Qualidade é obrigatória'),
  plot: z.string().min(10, 'Sinopse deve ter pelo menos 10 caracteres'),
  poster: z.string().url('URL do poster inválida'),
  backdrop: z.string().url('URL do backdrop inválida'),
  totalSeasons: z.number().min(1, 'Deve ter pelo menos 1 temporada'),
  totalEpisodes: z.number().min(1, 'Deve ter pelo menos 1 episódio'),
  network: z.string().optional(),
  creator: z.string().optional(),
});

export type TVShowFormData = z.infer<typeof tvshowSchema>;

const TVShowUpload: React.FC = () => {
  const [actors, setActors] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);

  const { loading, submitTVShow } = useTVShowSubmit();

  const form = useForm<TVShowFormData>({
    resolver: zodResolver(tvshowSchema),
    defaultValues: {
      title: '',
      originalTitle: '',
      year: new Date().getFullYear().toString(),
      rating: '',
      quality: 'HD',
      plot: '',
      poster: '',
      backdrop: '',
      totalSeasons: 1,
      totalEpisodes: 1,
      network: '',
      creator: '',
    }
  });

  const onSubmit = async (data: TVShowFormData) => {
    const success = await submitTVShow(data, actors, directors, producers, categories);
    
    if (success) {
      form.reset();
      setActors(['']);
      setDirectors(['']);
      setProducers(['']);
      setCategories(['']);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Tv className="w-5 h-5" />
          Adicionar Série
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TVShowBasicFields form={form} />
            
            <TVShowPersonnelFields
              actors={actors}
              setActors={setActors}
              directors={directors}
              setDirectors={setDirectors}
              producers={producers}
              setProducers={setProducers}
              categories={categories}
              setCategories={setCategories}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? 'Adicionando...' : 'Adicionar Série'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TVShowUpload;
