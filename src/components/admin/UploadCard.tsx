
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface UploadCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const UploadCard: React.FC<UploadCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  children,
  isExpanded = false,
  onToggle
}) => {
  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} border border-gray-700/50 shadow-2xl`}
      whileHover={{ y: -4, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
      
      <div 
        className="p-6 cursor-pointer select-none"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-white/70 text-sm">{description}</p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-white/70"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 border-t border-white/10">
          <div className="pt-6">
            {children}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadCard;
