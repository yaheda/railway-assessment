"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Environment } from "@/hooks/useWorkspaces";
import { useWorkspaceContext } from "@/context/WorkspaceContext";

interface EnvironmentSelectorProps {
  environments: Environment[];
  isLoading?: boolean;
  disabled?: boolean;
}

export function EnvironmentSelector({
  environments,
  isLoading = false,
  disabled = false,
}: EnvironmentSelectorProps) {
  const { selectedEnvironmentId, selectedEnvironmentName, selectEnvironment } = useWorkspaceContext();

  const selectedEnvironment =
    environments.find((e) => e.id === selectedEnvironmentId) || null;

  const handleSelectEnvironment = (environmentId: string, environmentName: string) => {
    selectEnvironment(environmentId, environmentName);
  };

  if (environments.length === 0) {
    return (
      <span className="text-sm text-foreground/60">No environments</span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-2"
          disabled={isLoading || disabled || environments.length === 0}
        >
          <span className="truncate max-w-xs">
            {isLoading
              ? "Loading..."
              : selectedEnvironmentName || "Select environment"}
          </span>
          <ChevronDown size={16} className="flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {environments.map((environment) => (
          <DropdownMenuItem
            key={environment.id}
            onClick={() => handleSelectEnvironment(environment.id, environment.name)}
            className="cursor-pointer"
          >
            {environment.name}
            {selectedEnvironmentName === environment.name && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
