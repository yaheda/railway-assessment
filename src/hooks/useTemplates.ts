import { useEffect, useState, useCallback } from "react";

export interface Template {
  name: string;
  code: string;
  id: string;
  category: string;
  description: string;
  isVerified: boolean;
  serializedConfig?: string;
  isV2Template: boolean;
}

interface UseTemplatesReturn {
  templates: Template[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Session-level cache for templates
let templateCache: Template[] | null = null;
let templateCachePromise: Promise<Template[]> | null = null;

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async (): Promise<Template[]> => {
    // Return cached data if available
    if (templateCache) {
      return templateCache;
    }

    // Return existing promise if request is already in flight
    if (templateCachePromise) {
      return templateCachePromise;
    }

    // Create new fetch promise
    templateCachePromise = (async () => {
      try {
        setError(null);
        const response = await fetch("/api/templates");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success || !data.templates) {
          throw new Error("Invalid response format from templates API");
        }

        // Cache the templates
        templateCache = data.templates;
        return data.templates;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch templates";
        setError(errorMessage);
        throw err;
      } finally {
        templateCachePromise = null;
      }
    })();

    return templateCachePromise;
  }, []);

  const refetch = useCallback(async () => {
    templateCache = null;
    templateCachePromise = null;
    await fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchTemplates();
        if (mounted) {
          setTemplates(data);
        }
      } catch (err) {
        if (mounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to fetch templates";
          setError(errorMessage);
          setTemplates([]);
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
  }, [fetchTemplates]);

  return { templates, isLoading, error, refetch };
}
