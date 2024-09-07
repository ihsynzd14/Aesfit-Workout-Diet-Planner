// hooks/useUpdateMetrics.ts

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { calculateHealthMetrics, HealthMetricsInput, HealthMetricsOutput } from '@/api/healthapi';

export function useUpdateMetrics() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateMetrics = async (formData: HealthMetricsInput): Promise<HealthMetricsOutput | null> => {
    setIsUpdating(true);
    try {
      const updatedMetrics = await calculateHealthMetrics(formData);
      toast({
        title: "Success",
        description: "Your health metrics have been updated.",
        duration: 3000,
      });
      return updatedMetrics;
    } catch (error) {
      console.error('Failed to update metrics:', error);
      toast({
        title: "Error",
        description: "Failed to update health metrics. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleUpdateMetrics, isUpdating };
}