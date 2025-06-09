
import React, { useState } from 'react';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import MovieBasicFields from './movie/MovieBasicFields';
import MovieMediaFields from './movie/MovieMediaFields';
import MoviePersonnelFields from './movie/MoviePersonnelFields';
import { useMovieSubmit } from './movie/useMovieSubmit';

const movieSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  originalTitle: z.string().optional(),
  year: z.string().min(4, 'Ano deve ter 4 dígitos'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  rating: z.string().min(1, 'Classificação é obrigatória'),
  quality: z.string().min(1, 'Qualidade é obrigatória'),
  plot: z.string().min(10, 'Sinopse deve ter pelo menos 10 caracteres'),
  poster: z.any()
    .optional()
    .nullable()
    .refine(value => {
      if (value === null || value === undefined) return true;
      if (value instanceof File) {
        return value.type.startsWith('image/');
      }
      if (typeof value === 'string') {
        return value.trim() !== '' && z.string().url().safeParse(value).success;
      }
      return false;
    }, { message: "Poster deve ser um arquivo de imagem válido ou uma URL válida." }),
  backdrop: z.any()
    .optional()
    .nullable()
    .refine(value => {
      if (value === null || value === undefined) return true;
      if (value instanceof File) {
        return value.type.startsWith('image/');
      }
      if (typeof value === 'string') {
        return value.trim() !== '' && z.string().url().safeParse(value).success;
      }
      return false;
    }, { message: "Backdrop deve ser um arquivo de imagem válido ou uma URL válida." }),
  playerUrl: z.any()
    .optional()
    .nullable()
    .refine(value => {
        if (value === null || value === undefined) return true;
        if (value instanceof File) {
            return value.type.startsWith('video/');
        }
        if (typeof value === 'string') {
            return value.trim() !== '' && z.string().url().safeParse(value).success;
        }
        return false;
    }, { message: "Player deve ser um arquivo de vídeo válido ou uma URL válida." }),
  actors: z.array(z.string()).optional(),
  directors: z.array(z.string()).optional(),
  producers: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

const MovieUpload: React.FC = () => {
  const [actors, setActors] = useState<string[]>(['']);
  const [directors, setDirectors] = useState<string[]>(['']);
  const [producers, setProducers] = useState<string[]>(['']);
  const [categories, setCategories] = useState<string[]>(['']);

  const { loading, submitMovie } = useMovieSubmit();

  const form = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: '',
      originalTitle: '',
      year: new Date().getFullYear().toString(),
      duration: '',
      rating: '',
      quality: 'HD',
      plot: '',
      poster: null,
      backdrop: null,
      playerUrl: null,
    }
  });

  const onSubmit = async (data: MovieFormData) => {
    const success = await submitMovie(data, actors, directors, producers, categories);
    
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
          <Film className="w-5 h-5" />
          Adicionar Filme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <MovieBasicFields form={form} />
            <MovieMediaFields form={form} />
            
            <MoviePersonnelFields
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
              {loading ? 'Adicionando...' : 'Adicionar Filme'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MovieUpload;
