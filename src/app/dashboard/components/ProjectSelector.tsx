"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Project {
  id: string;
  name: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ProjectSelector({
  projects,
  selectedProjectId,
  isLoading = false,
  disabled = false,
}: ProjectSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const handleSelectProject = (projectId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("project", projectId);
    router.push(`/dashboard?${params.toString()}`);
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
            {isLoading ? "Loading..." : selectedProject?.name || "Select project"}
          </span>
          <ChevronDown size={16} className="flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => handleSelectProject(project.id)}
            className="cursor-pointer"
          >
            {project.name}
            {selectedProject?.id === project.id && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
