'use client'

import React, { useRef, useCallback } from 'react';
import { useExerciseSearch } from '@/hooks/useExerciseSearch';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from 'next/image';
import { Dumbbell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ExerciseData {
  id: number;
  base_id: number;
  name: string;
  category: string;
  image: string | null;
  image_thumbnail: string | null;
}

interface ExerciseSuggestion {
  value: string;
  data: ExerciseData;
}

const ExerciseCard: React.FC<{ exercise: ExerciseSuggestion }> = ({ exercise }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader className="p-4 flex-shrink-0">
          <CardTitle className="text-lg truncate">{exercise.value}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="aspect-square relative mb-4 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
            {exercise.data.image || exercise.data.image_thumbnail ? (
              <Image
                src={`https://wger.de${exercise.data.image || exercise.data.image_thumbnail}`}
                alt={exercise.value}
                layout="fill"
                objectFit="cover"
                className="rounded-md transition-transform duration-300 hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <Dumbbell size={48} className="text-gray-400" />
            )}
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Category: {exercise.data.category}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">ID: {exercise.data.id}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function EnhancedExerciseSearchPage() {
  const { query, setQuery, exercises, isLoading, error, hasMore, loadMore } = useExerciseSearch();
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastExerciseElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMore]);

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Exercise Search
      </motion.h1>
      <motion.div 
        className="max-w-xl mx-auto mb-8 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Input
          type="text"
          placeholder="Search for exercises..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-300 focus:ring-opacity-50 transition duration-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      </motion.div>
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-20"
          >
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 dark:border-gray-700 h-12 w-12 animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p 
          className="text-center text-red-500 dark:text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
      
      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {exercises.map((exercise, index) => (
              <div key={exercise.data.id} ref={index === exercises.length - 1 ? lastExerciseElementRef : null} className="h-full">
                <ExerciseCard exercise={exercise} />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      {exercises.length === 0 && query && !isLoading && (
        <motion.p 
          className="text-center mt-4 text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          No exercises found. Try a different search term.
        </motion.p>
      )}
    </div>
  );
}