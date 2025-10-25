"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ServiceTypeSelector } from "./DeployWizardSteps/ServiceTypeSelector"
import { TemplateSelector } from "./DeployWizardSteps/TemplateSelector"
import { ConfirmationStep } from "./DeployWizardSteps/ConfirmationStep"
import { DeploymentSuccess } from "./DeployWizardSteps/DeploymentSuccess"
import { DeployWizardFooter } from "./DeployWizardFooter"
import { Template } from "@/hooks/useTemplates"
import { useDeploy, DeploymentInput } from "@/hooks/useDeploy"
import { useWorkspaceContext } from "@/context/WorkspaceContext"
import { AlertCircle } from "lucide-react"

export type ServiceType = "github" | "template" | null

interface DeployServiceWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeploymentSuccess?: () => void
}

export function DeployServiceWizard({
  open,
  onOpenChange,
  onDeploymentSuccess,
}: DeployServiceWizardProps) {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [workflowId, setWorkflowId] = useState<string | null>(null)
  const { deploy, isLoading: isDeploying } = useDeploy()

  // Get selections from context
  const {
    selectedWorkspaceId,
    selectedWorkspaceName,
    selectedProjectId,
    selectedProjectName,
    selectedEnvironmentId,
    selectedEnvironmentName,
    hasCompleteSelection,
  } = useWorkspaceContext()

  // Check if we have all required selections
  const hasAllSelections = hasCompleteSelection()

  const handleNext = async () => {
    if (step === 1 && !serviceType) return
    if (step === 2 && serviceType === "template" && !selectedTemplate) return

    // Handle deployment on step 3
    if (step === 3 && serviceType === "template" && selectedTemplate) {
      // Validate we have all selections
      if (!hasAllSelections) {
        return
      }

      try {
        const deploymentInput: DeploymentInput = {
          workspaceId: selectedWorkspaceId!,
          templateId: selectedTemplate.id,
          serializedConfig: selectedTemplate.serializedConfig,
          projectId: selectedProjectId!,
          environmentId: selectedEnvironmentId!,
        }

        const result = await deploy(deploymentInput)
        setWorkflowId(result.workflowId)
        setStep(4)
      } catch (error) {
        // Error is handled in the confirmation step
        console.error("Deployment failed:", error)
      }
      return
    }

    setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1 && step !== 4) {
      setStep(step - 1)
    }
  }

  const handleCancel = () => {
    setStep(1)
    setServiceType(null)
    setSelectedTemplate(null)
    setWorkflowId(null)
    onOpenChange(false)
  }

  const handleClose = () => {
    handleCancel()
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
  }

  const handleDeploymentSuccess = () => {
    onOpenChange(false)
    if (onDeploymentSuccess) {
      onDeploymentSuccess()
    }
  }

  // Show error if selections are incomplete when trying to open wizard
  const shouldShowIncompleteError = open && !hasAllSelections && step === 1

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deploy New Service</DialogTitle>
        </DialogHeader>

        <div className="min-h-[400px]">
          {shouldShowIncompleteError && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  Incomplete Selection
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-300/70 mt-1">
                  Please select a workspace, project, and environment before opening the deploy wizard.
                </p>
              </div>
            </div>
          )}
          {!shouldShowIncompleteError && step === 1 && (
            <ServiceTypeSelector
              selectedType={serviceType}
              onSelect={setServiceType}
            />
          )}
          {!shouldShowIncompleteError && step === 2 && serviceType === "template" && (
            <TemplateSelector
              selectedTemplateId={selectedTemplate?.id || null}
              onSelect={handleTemplateSelect}
            />
          )}
          {!shouldShowIncompleteError && step === 3 && serviceType === "template" && selectedTemplate && (
            <ConfirmationStep
              template={selectedTemplate}
              workspaceName={selectedWorkspaceName || ""}
              projectName={selectedProjectName || ""}
              environmentName={selectedEnvironmentName || ""}
              isDeploying={isDeploying}
            />
          )}
          {!shouldShowIncompleteError && step === 4 && workflowId && selectedTemplate && (
            <DeploymentSuccess
              workflowId={workflowId}
              templateName={selectedTemplate.name}
              onSuccess={handleDeploymentSuccess}
            />
          )}
        </div>

        {step !== 4 && (
          <DeployWizardFooter
            currentStep={step}
            totalSteps={4}
            canGoNext={
              step === 1
                ? serviceType !== null
                : step === 2 && serviceType === "template"
                  ? selectedTemplate !== null
                  : step === 3
                    ? !isDeploying
                    : true
            }
            onNext={handleNext}
            onBack={handleBack}
            onCancel={handleCancel}
            isDeploying={isDeploying && step === 3}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
