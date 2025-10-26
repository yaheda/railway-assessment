import { useCallback, useState } from "react";

export interface ServiceCreateInput {
  projectId: string;
  environmentId: string;
  name: string;
  repo?: string;
  image?: string;
}

export interface ServiceCreateResult {
  serviceId: string;
}

interface UseCreateServiceReturn {
  createService: (input: ServiceCreateInput) => Promise<ServiceCreateResult>;
  isLoading: boolean;
  error: string | null;
}

export function useCreateService(): UseCreateServiceReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createService = useCallback(
    async (input: ServiceCreateInput): Promise<ServiceCreateResult> => {
      try {
        setError(null);
        setIsLoading(true);

        if (!input.repo && !input.image) {
          throw new Error("Either repo or image must be provided");
        }

        const response = await fetch("/api/services/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success || !data.serviceId) {
          throw new Error("Invalid response format from service creation API");
        }

        return {
          serviceId: data.serviceId,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create service";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createService, isLoading, error };
}
