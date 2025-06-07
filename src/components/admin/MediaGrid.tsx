
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MediaUpload, getFileUrl } from '@/services/uploadService';

interface MediaGridProps {
  uploads: MediaUpload[];
  onStatusUpdate: (id: string, status: MediaUpload['status']) => void;
  onDelete: (id: string, filePath: string) => void;
  updatingStatus?: string | null;
}

const MediaGrid: React.FC<MediaGridProps> = ({
  uploads,
  onStatusUpdate,
  onDelete,
  updatingStatus
}) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      rejected: "bg-red-500/20 text-red-300 border-red-500/30",
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    };
    
    const labels = {
      approved: "Aprovado",
      rejected: "Rejeitado",
      pending: "Pendente"
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles]} border font-medium`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
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

  if (uploads.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Nenhum arquivo encontrado</h3>
        <p className="text-gray-400">Faça upload de alguns arquivos para começar</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {uploads.map((upload, index) => (
        <motion.div
          key={upload.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group relative bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300"
          whileHover={{ y: -4 }}
        >
          <div className="aspect-[4/3] relative overflow-hidden">
            <img
              src={getFileUrl(upload.file_path)}
              alt={upload.file_name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            <div className="absolute top-3 right-3">
              {getStatusBadge(upload.status)}
            </div>

            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-black/50 text-white border-gray-600">
                {getTypeLabel(upload.upload_type)}
              </Badge>
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-white mb-2 truncate">{upload.file_name}</h3>
            
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>{(upload.file_size / 1024 / 1024).toFixed(1)} MB</span>
              <span>{new Date(upload.created_at).toLocaleDateString('pt-BR')}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(getFileUrl(upload.file_path), '_blank')}
                className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </Button>

              {upload.status === 'pending' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStatusUpdate(upload.id, 'approved')}
                    disabled={updatingStatus === upload.id}
                    className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStatusUpdate(upload.id, 'rejected')}
                    disabled={updatingStatus === upload.id}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(upload.id, upload.file_path)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MediaGrid;
