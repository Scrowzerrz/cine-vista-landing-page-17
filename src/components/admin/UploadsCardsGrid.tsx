
import React from 'react';
import { Film, Tv, Upload } from 'lucide-react';
import UploadCard from './UploadCard';
import MovieUpload from './MovieUpload';
import TVShowUpload from './TVShowUpload';
import FileUpload from './FileUpload';

interface UploadsCardsGridProps {
  expandedCards: Record<string, boolean>;
  onToggleCard: (cardName: string) => void;
  onUploadSuccess: () => void;
}

const UploadsCardsGrid: React.FC<UploadsCardsGridProps> = ({
  expandedCards,
  onToggleCard,
  onUploadSuccess
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UploadCard
        title="Upload de Filmes"
        description="Adicione novos filmes à plataforma"
        icon={Film}
        color="from-purple-600 to-indigo-700"
        isExpanded={expandedCards.movies}
        onToggle={() => onToggleCard('movies')}
      >
        <MovieUpload />
      </UploadCard>

      <UploadCard
        title="Upload de Séries"
        description="Gerencie séries e episódios"
        icon={Tv}
        color="from-emerald-600 to-teal-700"
        isExpanded={expandedCards.tvshows}
        onToggle={() => onToggleCard('tvshows')}
      >
        <TVShowUpload />
      </UploadCard>

      <UploadCard
        title="Upload de Mídia"
        description="Envie imagens e outros arquivos"
        icon={Upload}
        color="from-orange-600 to-red-700"
        isExpanded={expandedCards.media}
        onToggle={() => onToggleCard('media')}
      >
        <FileUpload onUploadSuccess={onUploadSuccess} />
      </UploadCard>
    </div>
  );
};

export default UploadsCardsGrid;
