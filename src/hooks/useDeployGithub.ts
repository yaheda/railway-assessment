import { useCallback, useState } from "react";
import { useCreateService, ServiceCreateInput } from "./useCreateService";

export interface GithubDeployInput {
  projectId: string;
  environmentId: string;
  repoName: string;
  repoFullName: string;
}

export interface GithubDeployResult {
  serviceId: string;
}

interface UseDeployGithubReturn {
  deployGithub: (input: GithubDeployInput) => Promise<GithubDeployResult>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to orchestrate GitHub repository deployment
 * Step 1: Creates a new service
 * Step 2: (Future) Connects GitHub repository to the service
 */
export function useDeployGithub(): UseDeployGithubReturn {
  const { createService, isLoading: isCreatingService, error: createError } =
    useCreateService();
  const [error, setError] = useState<string | null>(null);

  const deployGithub = useCallback(
    async (input: GithubDeployInput): Promise<GithubDeployResult> => {
      try {
        setError(null);

        // Step 1: Create service with repository name
        const serviceInput: ServiceCreateInput = {
          projectId: input.projectId,
          environmentId: input.environmentId,
          name: input.repoName,
          repo: input.repoFullName,
        };

        const serviceResult = await createService(serviceInput);

        // Step 2: (Future) Connect GitHub repository to service
        // This will be implemented in the next phase
        // const githubConnectionResult = await connectGithubRepo({
        //   serviceId: serviceResult.serviceId,
        //   repoFullName: input.repoFullName,
        // });

        return {
          serviceId: serviceResult.serviceId,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to deploy GitHub repository";
        setError(errorMessage);
        throw err;
      }
    },
    [createService]
  );

  return {
    deployGithub,
    isLoading: isCreatingService,
    error: error || createError,
  };
}
