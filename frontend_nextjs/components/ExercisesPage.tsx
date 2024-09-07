import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  images: {
    image: string;
  }[];
}

export default function ExercisesPage() {
  const { categoryId, muscleId } = useParams<{ categoryId: string; muscleId: string }>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(`https://wger.de/api/v2/exercisebaseinfo/?category=${categoryId}&muscles=${muscleId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        setExercises(data.results);
      } catch (err) {
        setError('An error occurred while fetching exercises');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [categoryId, muscleId]);

  if (loading) {
    return <div>Loading exercises...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Exercises</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader>
              <CardTitle>{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {exercise.images && exercise.images.length > 0 && (
                <img src={exercise.images[0].image} alt={exercise.name} className="w-full h-48 object-cover mb-4" />
              )}
              <p className="text-sm mb-2">Category: {exercise.category.name}</p>
              <p className="text-sm mb-2">Muscles: {exercise.muscles.map(m => m.name_en || m.name).join(', ')}</p>
              <Button className="mt-4">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}