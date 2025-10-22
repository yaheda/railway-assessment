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
import type { Environment } from "@/hooks/useWorkspaces";

interface EnvironmentSelectorProps {
  environments: Environment[];
  selectedEnvironmentId: string | null;
  isLoading?: boolean;
  disabled?: boolean;
}

export function EnvironmentSelector({
  environments,
  selectedEnvironmentId,
  isLoading = false,
  disabled = false,
}: EnvironmentSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedEnvironment =
    environments.find((e) => e.id === selectedEnvironmentId) ||
    environments[0];

  const handleSelectEnvironment = (environmentId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("environment", environmentId);
    router.push(`/dashboard?${params.toString()}`);
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
              : selectedEnvironment?.name || "Select environment"}
          </span>
          <ChevronDown size={16} className="flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {environments.map((environment) => (
          <DropdownMenuItem
            key={environment.id}
            onClick={() => handleSelectEnvironment(environment.id)}
            className="cursor-pointer"
          >
            {environment.name}
            {selectedEnvironment?.id === environment.id && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
