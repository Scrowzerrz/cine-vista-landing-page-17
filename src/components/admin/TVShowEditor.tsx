
import React, { useState, useEffect } from 'react';
import { Search, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { TVShow } from '@/services/tvshowService';

const TVShowEditor: React.FC = () => {
  const [tvshows, setTVShows] = useState<TVShow[]>([]);
  const [filteredTVShows, setFilteredTVShows] = useState<TVShow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTVShow, setEditingTVShow] = useState<TVShow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTVShows();
  }, []);

  useEffect(() => {
    const filtered = tvshows.filter(tvshow =>
      tvshow.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tvshow.original_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tvshow.year.includes(searchTerm)
    );
    setFilteredTVShows(filtered);
  }, [tvshows, searchTerm]);

  const loadTVShows = async () => {
    try {
      const { data, error } = await supabase
        .from('tvshows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTVShows(data || []);
      setFilteredTVShows(data || []);
    } catch (error) {
      console.error('Error loading TV shows:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar séries.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (tvshow: TVShow) => {
    setEditingTVShow({ ...tvshow });
  };

  const handleCancel = () => {
    setEditingTVShow(null);
  };

  const handleSave = async () => {
    if (!editingTVShow) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('tvshows')
        .update({
          title: editingTVShow.title,
          original_title: editingTVShow.original_title,
          year: editingTVShow.year,
          rating: editingTVShow.rating,
          quality: editingTVShow.quality,
          plot: editingTVShow.plot,
          poster: editingTVShow.poster,
          backdrop: editingTVShow.backdrop,
          network: editingTVShow.network,
          creator: editingTVShow.creator,
          total_seasons: editingTVShow.total_seasons,
          total_episodes: editingTVShow.total_episodes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTVShow.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Série atualizada com sucesso!',
      });

      await loadTVShows();
      setEditingTVShow(null);
    } catch (error) {
      console.error('Error updating TV show:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar série.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof TVShow, value: string | number) => {
    if (!editingTVShow) return;
    setEditingTVShow({
      ...editingTVShow,
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
          placeholder="Buscar séries por título, título original ou ano..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-600 text-white"
        />
      </div>

      {/* Edit Form */}
      {editingTVShow && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Editando: {editingTVShow.title}
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
                  value={editingTVShow.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Título Original</Label>
                <Input
                  value={editingTVShow.original_title || ''}
                  onChange={(e) => handleInputChange('original_title', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Ano</Label>
                <Input
                  value={editingTVShow.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Classificação</Label>
                <Input
                  value={editingTVShow.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Qualidade</Label>
                <Input
                  value={editingTVShow.quality}
                  onChange={(e) => handleInputChange('quality', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Rede/Canal</Label>
                <Input
                  value={editingTVShow.network || ''}
                  onChange={(e) => handleInputChange('network', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Criador</Label>
                <Input
                  value={editingTVShow.creator || ''}
                  onChange={(e) => handleInputChange('creator', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Total de Temporadas</Label>
                <Input
                  type="number"
                  value={editingTVShow.total_seasons}
                  onChange={(e) => handleInputChange('total_seasons', parseInt(e.target.value) || 1)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Total de Episódios</Label>
                <Input
                  type="number"
                  value={editingTVShow.total_episodes}
                  onChange={(e) => handleInputChange('total_episodes', parseInt(e.target.value) || 1)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">URL do Poster</Label>
                <Input
                  value={editingTVShow.poster}
                  onChange={(e) => handleInputChange('poster', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">URL do Backdrop</Label>
                <Input
                  value={editingTVShow.backdrop}
                  onChange={(e) => handleInputChange('backdrop', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white">Sinopse</Label>
              <Textarea
                value={editingTVShow.plot}
                onChange={(e) => handleInputChange('plot', e.target.value)}
                rows={4}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* TV Shows List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTVShows.map((tvshow) => (
          <Card key={tvshow.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={tvshow.poster}
                  alt={tvshow.title}
                  className="w-16 h-24 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{tvshow.title}</h3>
                  <p className="text-gray-400 text-sm">{tvshow.year}</p>
                  <p className="text-gray-400 text-sm">{tvshow.total_seasons} Temporadas</p>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">{tvshow.plot}</p>
                  <Button
                    onClick={() => handleEdit(tvshow)}
                    size="sm"
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                    disabled={editingTVShow?.id === tvshow.id}
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

      {filteredTVShows.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">Nenhuma série encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default TVShowEditor;
