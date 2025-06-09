
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UploadCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}

const UploadCard: React.FC<UploadCardProps> = ({
  title,
  description,
  icon: Icon,
  color,
  isExpanded,
  onToggle,
  children,
  badge
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${isExpanded ? 'lg:col-span-3' : 'lg:col-span-1'} transition-all duration-300`}
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 overflow-hidden">
        <CardHeader 
          className={`bg-gradient-to-r ${color} relative cursor-pointer`}
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  {title}
                  {badge && (
                    <span className="px-2 py-1 text-xs bg-white/20 rounded-full">
                      {badge}
                    </span>
                  )}
                </CardTitle>
                <p className="text-white/80 text-sm">{description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="p-6">
              {children}
            </CardContent>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default UploadCard;
