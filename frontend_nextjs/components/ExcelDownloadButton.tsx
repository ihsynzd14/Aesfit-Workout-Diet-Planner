import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExcelDownloadButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const ExcelDownloadButton: React.FC<ExcelDownloadButtonProps> = ({ onClick, isLoading }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center space-x-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <FileDown className="w-5 h-5" />
            <span>Download Excel Report</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default ExcelDownloadButton;