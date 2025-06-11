
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllUploads, updateUploadStatus, deleteUpload, MediaUpload } from '@/services/uploadService';
import { toast } from '@/hooks/use-toast';
import UploadsHeader from './UploadsHeader';
import UploadsStatsGrid from './UploadsStatsGrid';
import UploadsCardsGrid from './UploadsCardsGrid';
import UploadsFilterTabs from './UploadsFilterTabs';
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
      <UploadsHeader onRefresh={loadUploads} />

      <UploadsStatsGrid uploads={uploads} />

      <UploadsCardsGrid
        expandedCards={expandedCards}
        onToggleCard={toggleCard}
        onUploadSuccess={loadUploads}
      />

      <UploadsFilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        stats={stats}
      />

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
