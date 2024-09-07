"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/lib/AuthContext';
import { calculateHealthMetrics, downloadExcelReport, fetchHealthMetrics, HealthMetricsInput, HealthMetricsOutput } from '../../api/healthapi';
import { Mail, User, Ruler, Weight, Activity, Calculator, Zap, Target, Calendar, LucideIcon, Loader2, ChevronDown, ChevronUp, Sparkles, Heart, Brain, Apple, Flag, TrendingDown, Minus, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import HealthMetricsForm from '../../components/HealthMetricsForm';
import MetricCard from '../../components/MetricCard';
import ExcelDownloadButton from '../../components/ExcelDownloadButton';
import { useExcelDownload } from '@/hooks/useExcelDownload';
import { useUpdateMetrics } from '@/hooks/useUpdateMetrics';

const DashboardPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetricsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  const goalOptions = [
    { value: "cut", label: "Cut", icon: TrendingDown, color: "text-red-500", description: "Lose weight" },
    { value: "maintain", label: "Maintain", icon: Minus, color: "text-yellow-500", description: "Maintain weight" },
    { value: "bulk", label: "Bulk", icon: TrendingUp, color: "text-green-500", description: "Gain muscle" },
  ];
  const { toast } = useToast();
  const { handleExcelDownload, isDownloading } = useExcelDownload();
  const { handleUpdateMetrics, isUpdating } = useUpdateMetrics();
  const [goal, setGoal] = useState("maintain"); // Add this line

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const fetchedMetrics = await fetchHealthMetrics();
      setMetrics(fetchedMetrics);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load health metrics. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateMetrics = async (formData: HealthMetricsInput) => {
    const updatedMetrics = await handleUpdateMetrics(formData);
    if (updatedMetrics) {
      setMetrics(updatedMetrics);
      toast({
        title: "Success",
        description: "Your health metrics have been updated.",
        duration: 3000,
      });
    }
  };

  const getHealthStatus = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  const getRecommendation = (metrics: HealthMetricsOutput) => {
    const status = getHealthStatus(metrics.bmi);
    switch (status) {
      case "Underweight":
        return "Consider increasing your calorie intake with nutrient-dense foods.";
      case "Healthy":
        return "Maintain your current lifestyle with a balanced diet and regular exercise.";
      case "Overweight":
        return "Focus on portion control and increasing physical activity.";
      case "Obese":
        return "Consult with a healthcare professional for a personalized weight management plan.";
      default:
        return "Maintain a balanced diet and regular exercise routine.";
    }
  };

  const getAdjustedCalories = (tdee: number, goal: string) => {
    switch (goal) {
      case "cut":
        return Math.round(tdee * 0.85); // 15% calorie deficit
      case "bulk":
        return Math.round(tdee * 1.15); // 15% calorie surplus
      default:
        return Math.round(tdee);
    }
  };

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case "cut":
        return "You're in a calorie deficit to lose weight.";
      case "bulk":
        return "You're in a calorie surplus to gain muscle mass.";
      default:
        return "You're maintaining your current weight.";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-10 px-4 space-y-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-4xl font-bold">Welcome, {user?.firstName}!</h1>
        <ExcelDownloadButton onClick={handleExcelDownload} isLoading={isDownloading} />
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="update">Update</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">Your Health Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-lg">BMI</span>
                  <span className="text-3xl font-bold">
                    {Number(metrics?.bmi ?? 0).toFixed(1)}
                  </span>
                  <span className="text-sm">
                    {getHealthStatus(Number(metrics?.bmi ?? 0))}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg">Daily Energy</span>
                  <span className="text-3xl font-bold">
                    {Number(metrics?.tdee ?? 0).toFixed(0)} cal
                  </span>
                  <span className="text-sm">Maintenance calories</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

          <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Flag className="h-6 w-6 text-blue-500" />
                <span>Set Your Goal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {goalOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card
                      className={`cursor-pointer ${goal === option.value ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setGoal(option.value)}
                    >
                      <CardContent className="flex flex-col items-center justify-center p-4">
                        <option.icon className={`h-8 w-8 ${option.color} mb-2`} />
                        <h3 className="text-lg font-semibold">{option.label}</h3>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-lg font-semibold mb-2">{getGoalDescription(goal)}</p>
                <p className="text-2xl font-bold text-blue-600">
                  {getAdjustedCalories(metrics?.tdee || 0, goal)} cal
                  <span className="text-sm text-gray-500 ml-2">per day</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <Heart className="h-6 w-6 text-red-500" />
                <CardTitle>Physical Health</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Your BMI indicates you're {getHealthStatus(metrics?.bmi || 0).toLowerCase()}. {getRecommendation(metrics!)}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <Brain className="h-6 w-6 text-blue-500" />
                <CardTitle>Mental Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Regular exercise and a balanced diet can boost your mood and cognitive function. Consider incorporating stress-reduction activities into your routine.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center space-x-2">
                <Apple className="h-6 w-6 text-green-500" />
                <CardTitle>Nutrition Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Aim for a balanced diet with plenty of fruits, vegetables, and whole grains. Based on your goal, your adjusted daily calorie needs are around {getAdjustedCalories(metrics?.tdee || 0, goal)} calories.</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        
        <TabsContent value="metrics" className="space-y-4">
          <AnimatePresence>
            {metrics && (
              <motion.div
                key="metrics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MetricCard title="Height" value={metrics.height} icon={Ruler} unit=" cm" />
                  <MetricCard title="Weight" value={metrics.weight} icon={Weight} unit=" kg" />
                  <MetricCard title="Age" value={metrics.age} icon={Calendar} unit=" years" />
                  {showAllMetrics && (
                    <>
                      <MetricCard title="Activity Level" value={metrics.activityLevel} icon={Target} />
                      <MetricCard title="Gender" value={metrics.gender} icon={User} />
                      <MetricCard title="BMI" value={metrics.bmi} icon={Calculator} />
                      <MetricCard title="Ideal Weight" value={metrics.idealWeight} icon={Target} unit=" kg" />
                      <MetricCard title="Basal Metabolic Rate" value={metrics.metabolicRate} icon={Zap} unit=" cal/day" />
                      <MetricCard title="Total Daily Energy Expenditure" value={metrics.tdee} icon={Activity} unit=" cal/day" />
                    </>
                  )}
                </div>
                <motion.div
                  className="flex justify-center mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setShowAllMetrics(!showAllMetrics)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <span>{showAllMetrics ? 'Show Less' : 'Show More'}</span>
                    {showAllMetrics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Update Your Health Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <HealthMetricsForm onSubmit={onUpdateMetrics} initialData={metrics} isLoading={isUpdating} />
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      
      <motion.div
        className="fixed bottom-4 right-4"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
          onClick={() => toast({
            title: "Tip of the Day",
            description: "Stay hydrated! Aim to drink at least 8 glasses of water today.",
            duration: 5000,
          })}
        >
          <Sparkles className="h-6 w-6 text-white" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;