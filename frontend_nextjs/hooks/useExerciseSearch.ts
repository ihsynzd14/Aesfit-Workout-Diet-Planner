import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface ExerciseData {
  id: number;
  base_id: number;
  name: string;
  category: string;
  image: string;
  image_thumbnail: string;
}

interface ExerciseSuggestion {
  value: string;
  data: ExerciseData;
}

interface ExerciseSearchResponse {
  suggestions: ExerciseSuggestion[];
}

export const useExerciseSearch = (initialQuery: string = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [exercises, setExercises] = useState<ExerciseSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const debouncedQuery = useDebounce(query, 300);

  const fetchExercises = useCallback(async (searchQuery: string, pageNumber: number) => {
    if (!searchQuery) {
      setExercises([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://wger.de/api/v2/exercise/search/?language=english&term=${encodeURIComponent(searchQuery)}&limit=20&offset=${(pageNumber - 1) * 20}`, {
        headers: {
          'accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }

      const data: ExerciseSearchResponse = await response.json();
      setExercises(prevExercises => pageNumber === 1 ? data.suggestions : [...prevExercises, ...data.suggestions]);
      setHasMore(data.suggestions.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchExercises(debouncedQuery, 1);
  }, [debouncedQuery, fetchExercises]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchExercises(debouncedQuery, nextPage);
    }
  }, [isLoading, hasMore, page, debouncedQuery, fetchExercises]);

  return { query, setQuery, exercises, isLoading, error, hasMore, loadMore };
};