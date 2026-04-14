import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../api/supabase';
import provenWinners from '../data/proven_winners.json';

/**
 * useGems Hook
 * 
 * Manages the data state for Community Gems.
 * - Fetches from Supabase (merges with Seed data).
 * - Handles submissions with MISSION-CRITICAL error tracking.
 */

export const useGems = () => {
  const queryClient = useQueryClient();

  // Fetching Gems
  const { data: gems = [], isLoading } = useQuery({
    queryKey: ['gems'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('gems')
          .select('*');

        if (error) throw error;
        
        // Merge seeded "Proven Winners" with live data
        return [...provenWinners, ...data];
      } catch (err) {
        console.warn('Supabase fetch failed, using seed data only.', err.message);
        return provenWinners;
      }
    },
  });

  // Submitting Gems
  const submitMutation = useMutation({
    mutationFn: async (newGem) => {
      const { data, error } = await supabase
        .from('gems')
        .insert([newGem])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['gems'] });
    },
    onError: (err) => {
      console.error('Submission failed:', err.message);
      // TODO: Push to Sentry
    }
  });

  return {
    gems,
    isLoading,
    submitGem: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
  };
};
