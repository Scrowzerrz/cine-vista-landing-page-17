
import React from 'react';
import { motion } from 'framer-motion';

interface FilterOption {
  key: string;
  label: string;
  count: number;
}

interface UploadsFilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

const UploadsFilterTabs: React.FC<UploadsFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  stats
}) => {
  const filters: FilterOption[] = [
    { key: 'all', label: 'Todos', count: stats.total },
    { key: 'pending', label: 'Pendentes', count: stats.pending },
    { key: 'approved', label: 'Aprovados', count: stats.approved },
    { key: 'rejected', label: 'Rejeitados', count: stats.rejected }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex items-center gap-4 bg-gray-900/50 backdrop-blur-sm rounded-xl p-2 border border-gray-700/50"
    >
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
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
  );
};

export default UploadsFilterTabs;
