"use client";

import { useEffect, useState, useCallback } from "react";

export interface ServiceSource {
  image?: string;
  repo?: string;
}

export interface ServiceDeployment {
  status?: string;
}

export interface ServiceInstance {
  id: string;
  serviceName: string;
  serviceId: string;
  source?: ServiceSource;
  createdAt?: string | Date;
  latestDeployment?: ServiceDeployment;
}

export interface Environment {
  id: string;
  name: string;
  serviceInstances: ServiceInstance[];
}

export interface Project {
  id: string;
  name: string;
  environments: Environment[];
}

export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
}

interface UseWorkspacesReturn {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Session-level cache for workspaces
let cachedWorkspaces: Workspace[] | null = null;
let isFetching = false;
let fetchPromise: Promise<Workspace[]> | null = null;

export function useWorkspaces(): UseWorkspacesReturn {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspaces = useCallback(async () => {
    // Return cached data if available
    if (cachedWorkspaces !== null) {
      setWorkspaces(cachedWorkspaces);
      setIsLoading(false);
      return cachedWorkspaces;
    }

    // If already fetching, wait for the existing request
    if (isFetching && fetchPromise) {
      const data = await fetchPromise;
      setWorkspaces(data);
      setIsLoading(false);
      return data;
    }

    // Start new fetch
    isFetching = true;
    setIsLoading(true);
    setError(null);

    try {
      fetchPromise = (async () => {
        const response = await fetch("/api/workspaces");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Failed to fetch workspaces"
          );
        }

        const data = await response.json();
        const fetchedWorkspaces = data.workspaces || [];
        
        // Cache the result for the session
        cachedWorkspaces = fetchedWorkspaces;

        return fetchedWorkspaces;
      })();

      const data = await fetchPromise;
      setWorkspaces(data);
      setIsLoading(false);
      setError(null);

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch workspaces";
      setError(errorMessage);
      setWorkspaces([]);
      throw err;
    } finally {
      isFetching = false;
      fetchPromise = null;
    }
  }, []);

  const refetch = useCallback(async () => {
    // Clear cache to force refetch
    cachedWorkspaces = null;
    isFetching = false;
    fetchPromise = null;
    await fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return {
    workspaces,
    isLoading,
    error,
    refetch,
  };
}
