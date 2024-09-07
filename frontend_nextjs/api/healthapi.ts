// api/healthapi.ts
import { getUserData } from '@/lib/userUtils';

export interface HealthMetricsInput {
  height: number;
  weight: number;
  age: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  gender: 'male' | 'female';
}

export interface HealthMetricsOutput extends HealthMetricsInput {
  bmi: number;
  metabolicRate: number;
  tdee: number;
  idealWeight: number;
}

export async function calculateHealthMetrics(input: HealthMetricsInput): Promise<HealthMetricsOutput> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`http://localhost:3001/api/health/calculate-metrics`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to calculate health metrics');
    }

    const calculatedMetrics = await response.json();
    return { ...input, ...calculatedMetrics };
  } catch (error) {
    console.error('Error calculating health metrics:', error);
    throw error;
  }
}

export async function fetchHealthMetrics(): Promise<HealthMetricsOutput> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch(`http://localhost:3001/api/health/metrics`, {
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to fetch health metrics');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    throw error;
  }
}

export async function downloadExcelReport(): Promise<void> {
  const userData = getUserData();
  if (!userData || !userData.token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await fetch('http://localhost:3001/api/health/excel-report', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download Excel report');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'health_metrics.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel report:', error);
    throw error;
  }
}
