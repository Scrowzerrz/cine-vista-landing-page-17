
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadsHeaderProps {
  onRefresh: () => void;
}

const UploadsHeader: React.FC<UploadsHeaderProps> = ({ onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Painel de Uploads</h1>
        <p className="text-gray-400">Gerencie todos os seus arquivos de mídia em um só lugar</p>
      </div>
      <Button 
        onClick={onRefresh} 
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Atualizar
      </Button>
    </motion.div>
  );
};

export default UploadsHeader;
