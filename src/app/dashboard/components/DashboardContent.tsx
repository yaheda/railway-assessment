"use client";

import { useMemo, useState, useEffect } from "react";
import { Plus, Power, Trash2, Container, Activity, Clock } from "lucide-react";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import { useEnvironmentStagedChanges } from "@/hooks/useEnvironmentStagedChanges";
import { useDeployStagedChanges } from "@/hooks/useDeployStagedChanges";
import { useDeleteService } from "@/hooks/useDeleteService";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProjectSelector } from "./ProjectSelector";
import { EnvironmentSelector } from "./EnvironmentSelector";
import { DeployServiceWizard } from "./DeployServiceWizard";
import { StagedChangesAlert } from "./StagedChangesAlert";

interface ServiceToDelete {
  id: string;
  name: string;
}

export function DashboardContent() {
  const { workspaces, isLoading: workspacesLoading, refetch } = useWorkspaces();
  const [deployWizardOpen, setDeployWizardOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceToDelete | null>(null);
  const { deleteService, isLoading: isDeletingService } = useDeleteService();
  const {
    selectedWorkspaceId,
    selectedProjectId,
    selectedEnvironmentId,
  } = useWorkspaceContext();

  // Track staged changes for current environment
  const { stagedChanges, refetch: refetchStagedChanges } =
    useEnvironmentStagedChanges(selectedEnvironmentId || null);

  // Hook for deploying staged changes
  const {
    deploy: deployStagedChanges,
    isLoading: isDeployingStagedChanges,
  } = useDeployStagedChanges();

  // Load staged changes when environment changes
  useEffect(() => {
    if (selectedEnvironmentId) {
      refetchStagedChanges();
    }
  }, [selectedEnvironmentId, refetchStagedChanges]);

  // Handle deploying staged changes
  const handleDeployStagedChanges = async () => {
    if (!selectedEnvironmentId) return;

    try {
      await deployStagedChanges({
        environmentId: selectedEnvironmentId,
        commitMessage: "Deployed from Railway Assessment Dashboard",
        skipDeploys: false,
      });

      // Refetch workspaces to update services list
      await refetch();
      // Refetch staged changes (should clear the alert)
      await refetchStagedChanges();
    } catch (error) {
      // Error is handled in the StagedChangesAlert component
      console.error("Failed to deploy staged changes:", error);
    }
  };

  // Get current workspace from context
  const currentWorkspace = useMemo(() => {
    if (selectedWorkspaceId) {
      return workspaces.find((w) => w.id === selectedWorkspaceId);
    }
    return undefined;
  }, [workspaces, selectedWorkspaceId]);

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

  // Get current project (default to first one)
  const currentProject = useMemo(() => {
    if (selectedProjectId) {
      return currentProjects.find((p) => p.id === selectedProjectId);
    }
    return currentProjects[0];
  }, [currentProjects, selectedProjectId]);

  // Get environments from current project
  const currentEnvironments = useMemo(() => {
    const project = currentProject;
    if (!project) return [];

    // Extract environments from project
    if (project.environments && Array.isArray(project.environments)) {
      return project.environments;
    }

    return [];
  }, [currentProject]);

  // Get current environment (default to first one)
  const currentEnvironment = useMemo(() => {
    if (selectedEnvironmentId) {
      return currentEnvironments.find((e) => e.id === selectedEnvironmentId);
    }
    return currentEnvironments[0];
  }, [currentEnvironments, selectedEnvironmentId]);

  // Get services from current environment
  const services = useMemo(() => {
    const environment = currentEnvironment;
    if (!environment) return [];

    // Extract service instances from environment
    if (
      environment.serviceInstances &&
      Array.isArray(environment.serviceInstances)
    ) {
      return environment.serviceInstances;
    }

    return [];
  }, [currentEnvironment]);

  // Calculate stats from services
  const activeCount = services.length; // All services are considered "active" if they're listed
  const totalMemory = 0; // Will be populated when we have resource data from API

  const handleDeploymentSuccess = async () => {
    // Refetch workspaces to update the services list
    await refetch();
    // Also check for staged changes
    if (selectedEnvironmentId) {
      await refetchStagedChanges();
    }
  };

  const handleDeleteClick = (serviceId: string, serviceName: string) => {
    setServiceToDelete({ id: serviceId, name: serviceName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!serviceToDelete || !selectedEnvironmentId) return;

    try {
      await deleteService({
        serviceId: serviceToDelete.id,
        environmentId: selectedEnvironmentId,
      });

      // Refetch workspaces to update services list
      await refetch();
      // Refetch staged changes
      await refetchStagedChanges();

      // Close dialog and clear state
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      // Error is shown in the component
      console.error("Failed to delete service:", error);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  return (
    <>
      <DeployServiceWizard
        open={deployWizardOpen}
        onOpenChange={setDeployWizardOpen}
        onDeploymentSuccess={handleDeploymentSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {serviceToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-4">
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeletingService}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeletingService ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-7xl mx-auto">
      {/* Staged Changes Alert */}
      {stagedChanges && (
        <div className="mb-8">
          <StagedChangesAlert
            stagedChanges={stagedChanges}
            onDeploy={handleDeployStagedChanges}
            isDeploying={isDeployingStagedChanges}
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2 flex-wrap">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          {currentProjects.length > 0 && (
            <ProjectSelector
              projects={currentProjects}
              isLoading={workspacesLoading}
            />
          )}
          {currentEnvironments.length > 0 && (
            <EnvironmentSelector
              environments={currentEnvironments}
              isLoading={workspacesLoading}
            />
          )}
        </div>
        <p className="text-foreground/60">
          Manage your containers and monitor their status
          {currentWorkspace && ` in ${currentWorkspace.name}`}
          {currentProject && ` / ${currentProject.name}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Containers */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground/70">
                Total Services
              </p>
              <p className="text-3xl font-bold mt-2">{services.length}</p>
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

      {/* Service Management Section */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Services in {currentEnvironment?.name || "Environment"}</h2>
          <Button
            className="gap-2"
            onClick={() => setDeployWizardOpen(true)}
          >
            <Plus size={18} />
            Deploy Service
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {services.length === 0 ? (
            <div className="p-8 text-center">
              <Container size={40} className="mx-auto text-foreground/30 mb-4" />
              <p className="text-foreground/60">
                {!currentEnvironment
                  ? "No environments selected. Select an environment to view services."
                  : "No services deployed in this environment yet."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/5">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Image / Repository
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Deployment Status
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
                {services.map((service, index) => {
                  const deploymentStatus =
                    service.latestDeployment?.status || "no-deployment";

                  const getStatusStyles = (status: string) => {
                    switch (status) {
                      case "SUCCESS":
                        return "bg-green-500/10 text-green-700 dark:text-green-400";
                      case "FAILED":
                        return "bg-red-500/10 text-red-700 dark:text-red-400";
                      case "IN_PROGRESS":
                        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
                      default:
                        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
                    }
                  };

                  const createdDate = service.createdAt
                    ? new Date(service.createdAt).toLocaleDateString()
                    : "Unknown";

                  const imageOrRepo =
                    service.source?.image ||
                    service.source?.repo ||
                    "N/A";

                  return (
                    <tr
                      key={`${service.id}-${service.serviceName}-${index}`}
                      className="border-b border-border hover:bg-secondary/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">
                        {service.serviceName}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        <code className="bg-secondary/20 px-2 py-1 rounded text-xs">
                          {imageOrRepo}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(deploymentStatus)}`}
                        >
                          {deploymentStatus === "SUCCESS"
                            ? "Deployed"
                            : deploymentStatus === "FAILED"
                              ? "Failed"
                              : deploymentStatus === "IN_PROGRESS"
                                ? "Deploying"
                                : "No Deployment"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70">
                        {createdDate}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                            title="Actions"
                          >
                            <Power size={18} className="text-foreground/50" />
                          </button>
                          <button
                            className="p-2 hover:bg-secondary/20 rounded-lg transition-colors"
                            title="Delete"
                            onClick={() => handleDeleteClick(service.serviceId, service.serviceName)}
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      </div>
    </>
  );
}
