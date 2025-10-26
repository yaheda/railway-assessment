import { useCallback, useState } from "react";
import { useCreateService, ServiceCreateInput } from "./useCreateService";
import { useServiceInstanceDeploy } from "./useServiceInstanceDeploy";

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
 * Step 2: Deploys the service instance immediately
 * Step 3: (Future) Deploy staged changes if any
 */
export function useDeployGithub(): UseDeployGithubReturn {
  const { createService, isLoading: isCreatingService, error: createError } =
    useCreateService();
  const {
    deploy: deployServiceInstance,
    isLoading: isDeployingService,
    error: deployError,
  } = useServiceInstanceDeploy();
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

        // Step 2: Deploy the service instance immediately
        await deployServiceInstance({
          serviceId: serviceResult.serviceId,
          environmentId: input.environmentId,
        });

        // Step 3: (Future) Deploy staged changes if needed
        // await deployStagedChanges({
        //   environmentId: input.environmentId,
        //   skipDeploys: false,
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
    [createService, deployServiceInstance]
  );

  return {
    deployGithub,
    isLoading: isCreatingService || isDeployingService,
    error: error || createError || deployError,
  };
}
