
import React, { useState, useEffect } from 'react';
import { FileImage, Check, X, Trash2, Eye, Film, Tv, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllUploads, updateUploadStatus, deleteUpload, getFileUrl, MediaUpload } from '@/services/uploadService';
import { toast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import MovieUpload from './MovieUpload';
import TVShowUpload from './TVShowUpload';

const UploadsPanel: React.FC = () => {
  const [uploads, setUploads] = useState<MediaUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const loadUploads = async () => {
    try {
      const data = await getAllUploads();
      setUploads(data);
    } catch (error) {
      console.error('Error loading uploads:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar uploads.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  const handleStatusUpdate = async (id: string, status: MediaUpload['status']) => {
    setUpdatingStatus(id);
    try {
      await updateUploadStatus(id, status);
      await loadUploads();
      toast({
        title: 'Sucesso',
        description: `Status atualizado para ${status === 'approved' ? 'aprovado' : 'rejeitado'}.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status.',
        variant: 'destructive'
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    if (!confirm('Tem certeza que deseja deletar este arquivo?')) {
      return;
    }

    try {
      await deleteUpload(id, filePath);
      await loadUploads();
      toast({
        title: 'Sucesso',
        description: 'Arquivo deletado com sucesso.'
      });
    } catch (error) {
      console.error('Error deleting upload:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao deletar arquivo.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'movie_poster': 'Poster de Filme',
      'movie_backdrop': 'Backdrop de Filme',
      'tvshow_poster': 'Poster de Série',
      'tvshow_backdrop': 'Backdrop de Série',
      'episode_poster': 'Poster de Episódio'
    };
    return types[type] || type;
  };

  const filteredUploads = (status?: string) => {
    if (!status) return uploads;
    return uploads.filter(upload => upload.status === status);
  };

  const UploadsList = ({ uploads }: { uploads: MediaUpload[] }) => (
    <div className="space-y-4">
      {uploads.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Nenhum upload encontrado.</p>
      ) : (
        uploads.map((upload) => (
          <Card key={upload.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={getFileUrl(upload.file_path)}
                    alt={upload.file_name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white truncate">
                        {upload.file_name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {getTypeLabel(upload.upload_type)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(upload.file_size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(upload.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(upload.status)}
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(getFileUrl(upload.file_path), '_blank')}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {upload.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(upload.id, 'approved')}
                              disabled={updatingStatus === upload.id}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStatusUpdate(upload.id, 'rejected')}
                              disabled={updatingStatus === upload.id}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(upload.id, upload.file_path)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Painel de Uploads</h1>
        <Button onClick={loadUploads} variant="outline">
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="movies" className="space-y-6">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="movies" className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            Filmes
          </TabsTrigger>
          <TabsTrigger value="tvshows" className="flex items-center gap-2">
            <Tv className="w-4 h-4" />
            Séries
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Mídia
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes ({filteredUploads('pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Aprovados ({filteredUploads('approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejeitados ({filteredUploads('rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies">
          <MovieUpload />
        </TabsContent>

        <TabsContent value="tvshows">
          <TVShowUpload />
        </TabsContent>

        <TabsContent value="media">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Enviar Arquivos de Mídia</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload onUploadSuccess={loadUploads} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <UploadsList uploads={filteredUploads('pending')} />
        </TabsContent>

        <TabsContent value="approved">
          <UploadsList uploads={filteredUploads('approved')} />
        </TabsContent>

        <TabsContent value="rejected">
          <UploadsList uploads={filteredUploads('rejected')} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploadsPanel;
