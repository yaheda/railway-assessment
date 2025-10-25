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

export type ServiceType = "github" | "template" | null

interface DeployServiceWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  workspaceName: string
  projectId: string
  projectName: string
  environmentId: string
  environmentName: string
  onDeploymentSuccess?: () => void
}

export function DeployServiceWizard({
  open,
  onOpenChange,
  workspaceId,
  workspaceName,
  projectId,
  projectName,
  environmentId,
  environmentName,
  onDeploymentSuccess,
}: DeployServiceWizardProps) {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [workflowId, setWorkflowId] = useState<string | null>(null)
  const { deploy, isLoading: isDeploying } = useDeploy()

  const handleNext = async () => {
    if (step === 1 && !serviceType) return
    if (step === 2 && serviceType === "template" && !selectedTemplate) return

    // Handle deployment on step 3
    if (step === 3 && serviceType === "template" && selectedTemplate) {
      try {
        debugger;
        
        const deploymentInput: DeploymentInput = {
          workspaceId,
          templateId: selectedTemplate.id,
          serializedConfig: selectedTemplate.serializedConfig,
          projectId,
          environmentId,
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Deploy New Service</DialogTitle>
        </DialogHeader>

        <div className="min-h-[400px]">
          {step === 1 && (
            <ServiceTypeSelector
              selectedType={serviceType}
              onSelect={setServiceType}
            />
          )}
          {step === 2 && serviceType === "template" && (
            <TemplateSelector
              selectedTemplateId={selectedTemplate?.id || null}
              onSelect={handleTemplateSelect}
            />
          )}
          {step === 3 && serviceType === "template" && selectedTemplate && (
            <ConfirmationStep
              template={selectedTemplate}
              workspaceName={workspaceName}
              projectName={projectName}
              environmentName={environmentName}
              isDeploying={isDeploying}
            />
          )}
          {step === 4 && workflowId && selectedTemplate && (
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
