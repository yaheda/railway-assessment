import { useEffect, useState, useCallback } from "react";

export interface GithubRepo {
  fullName: string;
  name: string;
  description: string;
}

interface UseGithubReposReturn {
  repos: GithubRepo[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Session-level cache for GitHub repos
let repoCache: GithubRepo[] | null = null;
let repoCachePromise: Promise<GithubRepo[]> | null = null;

export function useGithubRepos(): UseGithubReposReturn {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepos = useCallback(async (): Promise<GithubRepo[]> => {
    // Return cached data if available
    if (repoCache) {
      return repoCache;
    }

    // Return existing promise if request is already in flight
    if (repoCachePromise) {
      return repoCachePromise;
    }

    // Create new fetch promise
    repoCachePromise = (async () => {
      try {
        setError(null);
        const response = await fetch("/api/github-repos");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success || !data.repos) {
          throw new Error("Invalid response format from GitHub repos API");
        }

        // Cache the repos
        repoCache = data.repos;
        return data.repos;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch GitHub repositories";
        setError(errorMessage);
        throw err;
      } finally {
        repoCachePromise = null;
      }
    })();

    return repoCachePromise;
  }, []);

  const refetch = useCallback(async () => {
    repoCache = null;
    repoCachePromise = null;
    await fetchRepos();
  }, [fetchRepos]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchRepos();
        if (mounted) {
          setRepos(data);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch GitHub repositories";
          setError(errorMessage);
          setRepos([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetchRepos]);

  return { repos, isLoading, error, refetch };
}
