import { useCallback, useState } from "react";
import { Template } from "./useTemplates";

export interface DeploymentInput {
  workspaceId: string;
  templateId: string;
  serializedConfig: Record<any, unknown>;
  projectId: string;
  environmentId: string;
}

export interface DeploymentResult {
  workflowId: string;
  projectId: string;
}

interface UseDeployReturn {
  deploy: (input: DeploymentInput) => Promise<DeploymentResult>;
  isLoading: boolean;
  error: string | null;
}

export function useDeploy(): UseDeployReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deploy = useCallback(async (input: DeploymentInput): Promise<DeploymentResult> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch("/api/deploy", {
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

      if (!data.success || !data.workflowId) {
        throw new Error("Invalid response format from deploy API");
      }

      return {
        workflowId: data.workflowId,
        projectId: data.projectId,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to deploy template";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deploy, isLoading, error };
}

export interface WorkflowStatusResult {
  status?: string;
  error?: string | null;
}

interface UseWorkflowStatusReturn {
  checkStatus: (workflowId: string) => Promise<WorkflowStatusResult>;
  isLoading: boolean;
  error: string | null;
}

export function useWorkflowStatus(): UseWorkflowStatusReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(
    async (workflowId: string): Promise<WorkflowStatusResult> => {
      try {
        setError(null);
        setIsLoading(true);

        const response = await fetch(
          `/api/workflow-status?workflowId=${encodeURIComponent(workflowId)}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Invalid response format from workflow status API");
        }

        return {
          status: data.status,
          error: data.error,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check workflow status";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { checkStatus, isLoading, error };
}
