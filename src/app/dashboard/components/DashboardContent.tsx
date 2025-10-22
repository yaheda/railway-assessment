"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, Power, Trash2, Container, Activity, Clock } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { Button } from "@/components/ui/button";
import { ProjectSelector } from "./ProjectSelector";

interface Container {
  id: string;
  name: string;
  status: "running" | "stopped";
  memory: string;
  cpu: string;
  createdAt: Date;
}

// Mock data for containers
const MOCK_CONTAINERS: Container[] = [
  {
    id: "1",
    name: "web-app-prod",
    status: "running",
    memory: "512MB",
    cpu: "0.5",
    createdAt: new Date(2024, 9, 15),
  },
  {
    id: "2",
    name: "api-server-dev",
    status: "running",
    memory: "1GB",
    cpu: "1.0",
    createdAt: new Date(2024, 9, 10),
  },
  {
    id: "3",
    name: "cache-redis",
    status: "stopped",
    memory: "256MB",
    cpu: "0.25",
    createdAt: new Date(2024, 8, 20),
  },
  {
    id: "4",
    name: "worker-bg-tasks",
    status: "running",
    memory: "2GB",
    cpu: "2.0",
    createdAt: new Date(2024, 9, 1),
  },
];

export function DashboardContent() {
  const searchParams = useSearchParams();
  const { workspaces, isLoading: workspacesLoading } = useWorkspaces();
  const [containers, setContainers] = useState<Container[]>(MOCK_CONTAINERS);

  // Get current workspace and project from URL params
  const currentWorkspaceId = searchParams.get("workspace");
  const selectedProjectId = searchParams.get("project");

  // Get current workspace (default to first one)
  const currentWorkspace = useMemo(() => {
    if (currentWorkspaceId) {
      return workspaces.find((w) => w.id === currentWorkspaceId);
    }
    return workspaces[0];
  }, [workspaces, currentWorkspaceId]);

  // Get projects from current workspace
  const currentProjects = useMemo(() => {
    const workspace = currentWorkspace;
    if (!workspace) return [];

    // Extract projects from workspace
    if (workspace.projects && Array.isArray(workspace.projects)) {
      return workspace.projects;
    }

    return [];
  }, [currentWorkspace]);

  const activeCount = containers.filter((c) => c.status === "running").length;
  const totalMemory = containers.reduce((sum, c) => {
    const mb = parseInt(c.memory) * (c.memory.includes("GB") ? 1024 : 1);
    return sum + mb;
  }, 0);

  const toggleContainer = (id: string) => {
    setContainers(
      containers.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "running" ? "stopped" : "running",
            }
          : c
      )
    );
  };

  const deleteContainer = (id: string) => {
    setContainers(containers.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          {currentProjects.length > 0 && (
            <ProjectSelector
              projects={currentProjects}
              selectedProjectId={selectedProjectId}
              isLoading={workspacesLoading}
            />
          )}
        </div>
        <p className="text-foreground/60">
          Manage your containers and monitor their status
          {currentWorkspace && ` in ${currentWorkspace.name}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Containers */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/70">
                Total Containers
              </p>
              <p className="text-3xl font-bold mt-2">{containers.length}</p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3">
              <Container className="text-primary" size={28} />
            </div>
          </div>
        </div>

        {/* Active Containers */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/70">
                Active Containers
              </p>
              <p className="text-3xl font-bold mt-2">{activeCount}</p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-3">
              <Activity className="text-green-500" size={28} />
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/70">
                Memory Usage
              </p>
              <p className="text-3xl font-bold mt-2">
                {(totalMemory / 1024).toFixed(1)} GB
              </p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3">
              <Clock className="text-blue-500" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Container Management Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Containers</h2>
          <Button className="gap-2">
            <Plus size={18} />
            Create Container
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {containers.length === 0 ? (
            <div className="p-8 text-center">
              <Container size={40} className="mx-auto text-foreground/30 mb-4" />
              <p className="text-foreground/60">
                No containers yet. Create one to get started!
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/5">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Memory
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    CPU
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container) => (
                  <tr
                    key={container.id}
                    className="border-b border-border hover:bg-secondary/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{container.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          container.status === "running"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : "bg-gray-500/10 text-gray-700 dark:text-gray-400"
                        }`}
                      >
                        {container.status === "running"
                          ? "Running"
                          : "Stopped"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {container.memory}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {container.cpu} vCPU
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground/70">
                      {container.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleContainer(container.id)}
                          className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                          title={
                            container.status === "running"
                              ? "Stop"
                              : "Start"
                          }
                        >
                          <Power
                            size={18}
                            className={
                              container.status === "running"
                                ? "text-green-500"
                                : "text-gray-500"
                            }
                          />
                        </button>
                        <button
                          onClick={() => deleteContainer(container.id)}
                          className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
