
import React, { useState, useEffect } from 'react';
import { Search, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { getAllMovies } from '@/services/movieService';
import { supabase } from '@/integrations/supabase/client';
import type { Movie } from '@/types/movie';

const MovieEditor: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.original_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.year.includes(searchTerm)
    );
    setFilteredMovies(filtered);
  }, [movies, searchTerm]);

  const loadMovies = async () => {
    try {
      const data = await getAllMovies();
      setMovies(data);
      setFilteredMovies(data);
    } catch (error) {
      console.error('Error loading movies:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar filmes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie({ ...movie });
  };

  const handleCancel = () => {
    setEditingMovie(null);
  };

  const handleSave = async () => {
    if (!editingMovie) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('movies')
        .update({
          title: editingMovie.title,
          original_title: editingMovie.original_title,
          year: editingMovie.year,
          duration: editingMovie.duration,
          rating: editingMovie.rating,
          quality: editingMovie.quality,
          plot: editingMovie.plot,
          poster: editingMovie.poster,
          backdrop: editingMovie.backdrop,
          player_url: editingMovie.player_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingMovie.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Filme atualizado com sucesso!',
      });

      await loadMovies();
      setEditingMovie(null);
    } catch (error) {
      console.error('Error updating movie:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar filme.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Movie, value: string) => {
    if (!editingMovie) return;
    setEditingMovie({
      ...editingMovie,
      [field]: value
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Buscar filmes por título, título original ou ano..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-600 text-white"
        />
      </div>

      {/* Edit Form */}
      {editingMovie && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Editando: {editingMovie.title}
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Título</Label>
                <Input
                  value={editingMovie.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Título Original</Label>
                <Input
                  value={editingMovie.original_title || ''}
                  onChange={(e) => handleInputChange('original_title', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Ano</Label>
                <Input
                  value={editingMovie.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Duração</Label>
                <Input
                  value={editingMovie.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Classificação</Label>
                <Input
                  value={editingMovie.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Qualidade</Label>
                <Input
                  value={editingMovie.quality}
                  onChange={(e) => handleInputChange('quality', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">URL do Poster</Label>
                <Input
                  value={editingMovie.poster}
                  onChange={(e) => handleInputChange('poster', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">URL do Backdrop</Label>
                <Input
                  value={editingMovie.backdrop}
                  onChange={(e) => handleInputChange('backdrop', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-white">URL do Player</Label>
                <Input
                  value={editingMovie.player_url}
                  onChange={(e) => handleInputChange('player_url', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Sinopse</Label>
              <Textarea
                value={editingMovie.plot}
                onChange={(e) => handleInputChange('plot', e.target.value)}
                rows={4}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Movies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMovies.map((movie) => (
          <Card key={movie.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{movie.title}</h3>
                  <p className="text-gray-400 text-sm">{movie.year}</p>
                  <p className="text-gray-400 text-sm">{movie.quality}</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{movie.plot}</p>
                  <Button
                    onClick={() => handleEdit(movie)}
                    size="sm"
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                    disabled={editingMovie?.id === movie.id}
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">Nenhum filme encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default MovieEditor;
