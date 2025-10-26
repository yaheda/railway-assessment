import { useCallback, useState } from "react";

export interface ServiceInstanceDeployInput {
  serviceId: string;
  environmentId: string;
}

interface UseServiceInstanceDeployReturn {
  deploy: (input: ServiceInstanceDeployInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to deploy a specific service instance
 * Triggers the serviceInstanceDeployV2 mutation to start deployment
 */
export function useServiceInstanceDeploy(): UseServiceInstanceDeployReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deploy = useCallback(
    async (input: ServiceInstanceDeployInput): Promise<void> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch("/api/service-instance-deploy", {
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

        if (!data.success) {
          throw new Error("Failed to deploy service instance");
        }

        if (!data.deployed) {
          throw new Error(
            "Service instance deployment did not complete successfully"
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to deploy service instance";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { deploy, isLoading, error };
}
