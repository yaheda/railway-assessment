"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface SelectionState {
  workspaceId: string | null;
  workspaceName: string | null;
  projectId: string | null;
  projectName: string | null;
  environmentId: string | null;
  environmentName: string | null;
}

interface WorkspaceContextType {
  // Current selections
  selectedWorkspaceId: string | null;
  selectedWorkspaceName: string | null;
  selectedProjectId: string | null;
  selectedProjectName: string | null;
  selectedEnvironmentId: string | null;
  selectedEnvironmentName: string | null;

  // Selection methods
  selectWorkspace: (id: string, name: string) => void;
  selectProject: (id: string, name: string) => void;
  selectEnvironment: (id: string, name: string) => void;

  // Query methods
  hasCompleteSelection: () => boolean;
  getSelections: () => SelectionState;
  clearAll: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProjectName, setSelectedProjectName] = useState<string | null>(null);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string | null>(null);
  const [selectedEnvironmentName, setSelectedEnvironmentName] = useState<string | null>(null);

  const selectWorkspace = useCallback((id: string, name: string) => {
    setSelectedWorkspaceId(id);
    setSelectedWorkspaceName(name);
    // Reset project and environment when workspace changes
    setSelectedProjectId(null);
    setSelectedProjectName(null);
    setSelectedEnvironmentId(null);
    setSelectedEnvironmentName(null);
  }, []);

  const selectProject = useCallback((id: string, name: string) => {
    setSelectedProjectId(id);
    setSelectedProjectName(name);
    // Reset environment when project changes
    setSelectedEnvironmentId(null);
    setSelectedEnvironmentName(null);
  }, []);

  const selectEnvironment = useCallback((id: string, name: string) => {
    setSelectedEnvironmentId(id);
    setSelectedEnvironmentName(name);
  }, []);

  const hasCompleteSelection = useCallback(() => {
    return (
      selectedWorkspaceId !== null &&
      selectedProjectId !== null &&
      selectedEnvironmentId !== null
    );
  }, [selectedWorkspaceId, selectedProjectId, selectedEnvironmentId]);

  const getSelections = useCallback(() => ({
    workspaceId: selectedWorkspaceId,
    workspaceName: selectedWorkspaceName,
    projectId: selectedProjectId,
    projectName: selectedProjectName,
    environmentId: selectedEnvironmentId,
    environmentName: selectedEnvironmentName,
  }), [selectedWorkspaceId, selectedWorkspaceName, selectedProjectId, selectedProjectName, selectedEnvironmentId, selectedEnvironmentName]);

  const clearAll = useCallback(() => {
    setSelectedWorkspaceId(null);
    setSelectedWorkspaceName(null);
    setSelectedProjectId(null);
    setSelectedProjectName(null);
    setSelectedEnvironmentId(null);
    setSelectedEnvironmentName(null);
  }, []);

  const value: WorkspaceContextType = {
    selectedWorkspaceId,
    selectedWorkspaceName,
    selectedProjectId,
    selectedProjectName,
    selectedEnvironmentId,
    selectedEnvironmentName,
    selectWorkspace,
    selectProject,
    selectEnvironment,
    hasCompleteSelection,
    getSelections,
    clearAll,
  };

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspaceContext must be used within WorkspaceProvider");
  }
  return context;
}
