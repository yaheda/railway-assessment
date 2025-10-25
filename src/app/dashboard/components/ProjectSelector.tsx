"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

export interface Project {
  id: string;
  name: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  isLoading?: boolean;
  disabled?: boolean;
}

export function ProjectSelector({
  projects,
  isLoading = false,
  disabled = false,
}: ProjectSelectorProps) {
  const { selectedProjectId, selectedProjectName, selectProject } = useWorkspaceContext();

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || null;

  const handleSelectProject = (projectId: string, projectName: string) => {
    selectProject(projectId, projectName);
  };

  if (projects.length === 0) {
    return (
      <span className="text-sm text-foreground/60">No projects available</span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2"
          disabled={isLoading || disabled || projects.length === 0}
        >
          <span className="truncate max-w-xs">
            {isLoading ? "Loading..." : selectedProjectName || "Select project"}
          </span>
          <ChevronDown size={16} className="flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleSelectProject(project.id, project.name)}
            className="cursor-pointer"
          >
            {project.name}
            {selectedProjectName === project.name && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
