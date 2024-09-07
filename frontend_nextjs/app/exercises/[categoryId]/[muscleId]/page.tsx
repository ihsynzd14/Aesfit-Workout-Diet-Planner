'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Search, Dumbbell, Image, List } from 'lucide-react';

interface Exercise {
  id: number;
  uuid: string;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  muscles: {
    id: number;
    name: string;
    name_en: string;
  }[];
  muscles_secondary: {
    id: number;
    name: string;
    name_en: string;
  }[];
  equipment: {
    id: number;
    name: string;
  }[];
  images: {
    id: number;
    uuid: string;
    exercise_base: number;
    image: string;
    is_main: boolean;
  }[];
  exercises: {
    id: number;
    uuid: string;
    name: string;
    description: string;
  }[];
}

export default function ExercisesPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const muscleId = params.muscleId as string;
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;

  const filteredExercises = exercises.filter(exercise => {
    const exerciseName = exercise?.name || exercise?.exercises?.[0]?.name || '';
    return exerciseName.toLowerCase().includes(searchTerm.toLowerCase());
  });
 
  const getExerciseName = (exercise: Exercise) => {
    return exercise.name || exercise.exercises?.[0]?.name || 'Unnamed Exercise';
  };
 
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`https://wger.de/api/v2/exercisebaseinfo/?category=${categoryId}&muscles=${muscleId}&limit=100`);
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        const sortedExercises = data.results.sort((a: Exercise, b: Exercise) => {
          if (a.images.length && !b.images.length) return -1;
          if (!a.images.length && b.images.length) return 1;
          return 0;
        });
        setExercises(sortedExercises);
      } catch (err) {
        setError('An error occurred while fetching exercises');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [categoryId, muscleId]);



  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Loading Exercises...</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6 text-red-500">Oops! Something went wrong</h1>
        <p className="text-xl">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Specific Muscle Exercises</h1>
      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentExercises.map((exercise) => (
          <Card key={exercise.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative h-64 overflow-hidden">
              {exercise.images && exercise.images.length > 0 ? (
                <img 
                  src={exercise.images[0].image} 
                  alt={getExerciseName(exercise)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Dumbbell className="text-gray-400 w-16 h-16" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button 
                  className="bg-white text-black hover:bg-blue-500 hover:text-white transition-colors duration-300"
                  onClick={() => setSelectedExercise(exercise)}
                >
                  View Details
                </Button>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl truncate">{getExerciseName(exercise)}</CardTitle>
              <CardDescription className="truncate">{exercise.category?.name || 'Uncategorized'}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {filteredExercises.length > exercisesPerPage && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <Button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="p-2 rounded-full"
          >
            <ChevronLeft />
          </Button>
          <span>{currentPage} of {Math.ceil(filteredExercises.length / exercisesPerPage)}</span>
          <Button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === Math.ceil(filteredExercises.length / exercisesPerPage)}
            className="p-2 rounded-full"
          >
            <ChevronRight />
          </Button>
        </div>
      )}

<Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        {selectedExercise && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {getExerciseName(selectedExercise)}
              </DialogTitle>
              <DialogDescription>{selectedExercise.category?.name || 'Uncategorized'}</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details" className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>Details</span>
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span>Images</span>
                </TabsTrigger>
                <TabsTrigger value="variations" className="flex items-center space-x-2">
                  <Dumbbell className="w-4 h-4" />
                  <span>Variations</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-sm mb-4" dangerouslySetInnerHTML={{ __html: selectedExercise.description || 'No description available' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Muscles Worked</h3>
                    <p className="text-sm mb-2">
                      <strong>Primary:</strong> {selectedExercise.muscles?.map(m => m.name_en || m.name).join(', ') || 'Not specified'}
                    </p>
                    {selectedExercise.muscles_secondary?.length > 0 && (
                      <p className="text-sm mb-2">
                        <strong>Secondary:</strong> {selectedExercise.muscles_secondary.map(m => m.name_en || m.name).join(', ')}
                      </p>
                    )}
                    {selectedExercise.equipment?.length > 0 && (
                      <p className="text-sm mb-2">
                        <strong>Equipment:</strong> {selectedExercise.equipment.map(e => e.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="images">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedExercise.images?.length > 0 ? (
                    selectedExercise.images.map((image, index) => (
                      <img 
                        key={image.id} 
                        src={image.image} 
                        alt={`${selectedExercise.name || 'Exercise'} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                      />
                    ))
                  ) : (
                    <p>No images available for this exercise.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="variations">
                {selectedExercise.exercises?.length > 0 ? (
                  <ul className="space-y-4">
                    {selectedExercise.exercises.map(exercise => (
                      <li key={exercise.id} className="border-b pb-4 last:border-b-0">
                        <h4 className="font-semibold mb-2">{exercise.name || 'Unnamed Variation'}</h4>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: exercise.description || 'No description available' }} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No variations available for this exercise.</p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}