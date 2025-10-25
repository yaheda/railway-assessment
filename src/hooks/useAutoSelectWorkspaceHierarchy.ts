import { useEffect } from "react";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import type { Workspace, Project, Environment } from "@/hooks/useWorkspaces";

interface UseAutoSelectWorkspaceHierarchyProps {
  workspaces: Workspace[];
  isLoading: boolean;
}

/**
 * Hook to automatically select the first workspace, project, and environment
 * when the user first visits the dashboard.
 *
 * Respects existing selections - won't override if user has already selected.
 */
export function useAutoSelectWorkspaceHierarchy({
  workspaces,
  isLoading,
}: UseAutoSelectWorkspaceHierarchyProps) {
  const {
    selectedWorkspaceId,
    selectedProjectId,
    selectedEnvironmentId,
    selectWorkspace,
    selectProject,
    selectEnvironment,
  } = useWorkspaceContext();

  // Auto-select first workspace if none selected
  useEffect(() => {
    if (!isLoading && workspaces.length > 0 && !selectedWorkspaceId) {
      const firstWorkspace = workspaces[0];
      selectWorkspace(firstWorkspace.id, firstWorkspace.name);
    }
  }, [workspaces, isLoading, selectedWorkspaceId, selectWorkspace]);

  // Auto-select first project when workspace is selected
  useEffect(() => {
    if (selectedWorkspaceId && !selectedProjectId) {
      const workspace = workspaces.find((w) => w.id === selectedWorkspaceId);
      if (workspace && workspace.projects && workspace.projects.length > 0) {
        const firstProject = workspace.projects[0];
        selectProject(firstProject.id, firstProject.name);
      }
    }
  }, [
    selectedWorkspaceId,
    selectedProjectId,
    workspaces,
    selectProject,
  ]);

  // Auto-select first environment when project is selected
  useEffect(() => {
    if (
      selectedWorkspaceId &&
      selectedProjectId &&
      !selectedEnvironmentId
    ) {
      const workspace = workspaces.find((w) => w.id === selectedWorkspaceId);
      const project = workspace?.projects?.find(
        (p) => p.id === selectedProjectId
      );
      
      if (project && project.environments && project.environments.length > 0) {
        const firstEnvironment = project.environments[0];
        selectEnvironment(firstEnvironment.id, firstEnvironment.name);
      }
    }
  }, [
    selectedWorkspaceId,
    selectedProjectId,
    selectedEnvironmentId,
    workspaces,
    selectEnvironment,
  ]);
}
