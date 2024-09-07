// hooks/useExcelDownload.ts

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { downloadExcelReport } from '@/api/healthapi';

export function useExcelDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleExcelDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadExcelReport();
      toast({
        title: "Success",
        description: "Excel report has been downloaded.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to download Excel report:', error);
      toast({
        title: "Error",
        description: "Failed to download Excel report. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return { handleExcelDownload, isDownloading };
}