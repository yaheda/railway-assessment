"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface Project {
  id: string;
  name: string;
}

export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
}

interface WorkspaceContextType {
  selectedWorkspaceId: string | null;
  selectedProjectId: string | null;
  setSelectedWorkspace: (workspaceId: string) => void;
  setSelectedProject: (projectId: string) => void;
  getCurrentWorkspace: (workspaces: Workspace[]) => Workspace | undefined;
  getCurrentProject: () => Project | undefined;
  getProjectsByWorkspace: (workspaceId: string, workspaces: Workspace[]) => Project[];
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const setSelectedWorkspace = useCallback((workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    // Reset project selection when workspace changes
    setSelectedProjectId(null);
  }, []);

  const setSelectedProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
  }, []);

  const getCurrentWorkspace = useCallback(
    (workspaces: Workspace[]) => {
      if (!selectedWorkspaceId) return workspaces[0];
      return workspaces.find((w) => w.id === selectedWorkspaceId);
    },
    [selectedWorkspaceId]
  );

  const getCurrentProject = useCallback(() => {
    // This would need access to workspaces to work properly
    // Better to pass workspaces as parameter
    return undefined;
  }, []);

  const getProjectsByWorkspace = useCallback(
    (workspaceId: string, workspaces: Workspace[]) => {
      const workspace = workspaces.find((w) => w.id === workspaceId);
      return workspace?.projects || [];
    },
    []
  );

  const value: WorkspaceContextType = {
    selectedWorkspaceId,
    selectedProjectId,
    setSelectedWorkspace,
    setSelectedProject,
    getCurrentWorkspace,
    getCurrentProject,
    getProjectsByWorkspace,
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
