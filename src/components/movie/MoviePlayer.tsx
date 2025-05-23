
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface MoviePlayerProps {
  open: boolean;
  onClose: () => void;
  playerUrl: string;
  title: string;
}

const MoviePlayer: React.FC<MoviePlayerProps> = ({ open, onClose, playerUrl, title }) => {
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[900px] bg-gray-900 border-gray-700">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle className="text-xl text-white">{title}</DialogTitle>
          <DialogClose className="absolute right-4 top-4 p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <div className="aspect-video w-full rounded-lg overflow-hidden">
          <iframe
            src={playerUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title={`${title} - Player`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoviePlayer;
