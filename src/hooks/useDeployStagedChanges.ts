import { useCallback, useState } from "react";

export interface EnvironmentPatchCommitInput {
  environmentId: string;
  commitMessage?: string;
  skipDeploys?: boolean;
}

interface UseDeployStagedChangesReturn {
  deploy: (input: EnvironmentPatchCommitInput) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to deploy/commit staged changes in an environment
 * Calls the environmentPatchCommitStaged mutation to commit pending changes
 * and optionally auto-deploy them
 */
export function useDeployStagedChanges(): UseDeployStagedChangesReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deploy = useCallback(
    async (input: EnvironmentPatchCommitInput): Promise<void> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch("/api/environment-patch-commit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            environmentId: input.environmentId,
            commitMessage:
              input.commitMessage ||
              "Deployed from Railway Assessment Dashboard",
            skipDeploys: input.skipDeploys ?? false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Failed to commit staged changes");
        }

        // Mutation returns boolean, but we confirm success via response.success
        if (!data.committed) {
          throw new Error(
            "Staged changes could not be committed - verify changes are pending"
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to deploy staged changes";
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
