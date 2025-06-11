
import React from 'react';
import { FileImage, Clock, CheckCircle, XCircle } from 'lucide-react';
import { MediaUpload } from '@/services/uploadService';
import StatsCard from './StatsCard';

interface UploadsStatsGridProps {
  uploads: MediaUpload[];
}

const UploadsStatsGrid: React.FC<UploadsStatsGridProps> = ({ uploads }) => {
  const stats = {
    total: uploads.length,
    pending: uploads.filter(u => u.status === 'pending').length,
    approved: uploads.filter(u => u.status === 'approved').length,
    rejected: uploads.filter(u => u.status === 'rejected').length
  };

  return (
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
  );
};

export default UploadsStatsGrid;
