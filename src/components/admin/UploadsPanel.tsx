import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileImage, 
  Film, 
  Tv, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  Play,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllUploads, updateUploadStatus, deleteUpload, MediaUpload } from '@/services/uploadService';
import { toast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import MovieUpload from './MovieUpload';
import TVShowUpload from './TVShowUpload';
import UploadCard from './UploadCard';
import StatsCard from './StatsCard';
import MediaGrid from './MediaGrid';

const UploadsPanel: React.FC = () => {
  const [uploads, setUploads] = useState<MediaUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    movies: false,
    tvshows: false,
    media: false
  });

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

  const toggleCard = (cardName: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardName]: !prev[cardName]
    }));
  };

  const filteredUploads = (status?: string) => {
    if (!status || status === 'all') return uploads;
    return uploads.filter(upload => upload.status === status);
  };

  const stats = {
    total: uploads.length,
    pending: uploads.filter(u => u.status === 'pending').length,
    approved: uploads.filter(u => u.status === 'approved').length,
    rejected: uploads.filter(u => u.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Painel de Uploads Avançado</h1>
          <p className="text-gray-400">Sistema completo de gerenciamento de conteúdo com temporadas, episódios e players</p>
        </div>
        <Button 
          onClick={loadUploads} 
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Arquivos"
          value={stats.total}
          icon={FileImage}
          color="from-blue-600 to-blue-800"
          delay={0}
        />
        <StatsCard
          title="Pendentes"
          value={stats.pending}
          icon={Clock}
          color="from-yellow-600 to-orange-600"
          delay={0.1}
        />
        <StatsCard
          title="Aprovados"
          value={stats.approved}
          icon={CheckCircle}
          color="from-emerald-600 to-green-600"
          delay={0.2}
        />
        <StatsCard
          title="Rejeitados"
          value={stats.rejected}
          icon={XCircle}
          color="from-red-600 to-pink-600"
          delay={0.3}
        />
      </div>

      {/* Enhanced Upload Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UploadCard
          title="Sistema de Filmes"
          description="Upload completo com player integrado e metadados"
          icon={Film}
          color="from-purple-600 to-indigo-700"
          isExpanded={expandedCards.movies}
          onToggle={() => toggleCard('movies')}
          badge="Player Incluído"
        >
          <MovieUpload />
        </UploadCard>

        <UploadCard
          title="Sistema de Séries"
          description="Gerenciamento completo de temporadas e episódios"
          icon={Tv}
          color="from-emerald-600 to-teal-700"
          isExpanded={expandedCards.tvshows}
          onToggle={() => toggleCard('tvshows')}
          badge="Temporadas & Episódios"
        >
          <TVShowUpload />
        </UploadCard>

        <UploadCard
          title="Upload de Mídia"
          description="Envie imagens, trailers e outros arquivos"
          icon={Upload}
          color="from-orange-600 to-red-700"
          isExpanded={expandedCards.media}
          onToggle={() => toggleCard('media')}
          badge="Múltiplos Formatos"
        >
          <FileUpload onUploadSuccess={loadUploads} />
        </UploadCard>
      </div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-4 bg-gray-900/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50"
      >
        {[
          { key: 'all', label: 'Todos', count: stats.total },
          { key: 'pending', label: 'Pendentes', count: stats.pending },
          { key: 'approved', label: 'Aprovados', count: stats.approved },
          { key: 'rejected', label: 'Rejeitados', count: stats.rejected }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeFilter === filter.key
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span>{filter.label}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              activeFilter === filter.key 
                ? 'bg-white/20' 
                : 'bg-gray-700'
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Media Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <MediaGrid
          uploads={filteredUploads(activeFilter)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
          updatingStatus={updatingStatus}
        />
      </motion.div>
    </div>
  );
};

export default UploadsPanel;
