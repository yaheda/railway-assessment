import { useCallback, useState } from "react";

export interface EnvironmentStagedChange {
  id: string;
  status: string;
  lastAppliedError: string | null;
}

interface UseEnvironmentStagedChangesReturn {
  stagedChanges: EnvironmentStagedChange | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useEnvironmentStagedChanges(
  environmentId: string | null
): UseEnvironmentStagedChangesReturn {
  const [stagedChanges, setStagedChanges] = useState<EnvironmentStagedChange | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStagedChanges = useCallback(async () => {
    if (!environmentId) {
      setStagedChanges(null);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch("/api/environment-staged-changes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ environmentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error("Invalid response format from staged changes API");
      }

      setStagedChanges(data.stagedChanges || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch environment staged changes";
      setError(errorMessage);
      setStagedChanges(null);
    } finally {
      setIsLoading(false);
    }
  }, [environmentId]);

  const refetch = useCallback(async () => {
    await fetchStagedChanges();
  }, [fetchStagedChanges]);

  // Initial fetch when environmentId changes
  // Using a simple useEffect-like pattern via callback
  // Note: This hook doesn't use useEffect to allow explicit control over when to fetch
  // Call refetch() manually in components that need to load staged changes

  return { stagedChanges, isLoading, error, refetch };
}
