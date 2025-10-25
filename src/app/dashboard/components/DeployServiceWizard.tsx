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
import { DeployWizardFooter } from "./DeployWizardFooter"
import { Template } from "@/hooks/useTemplates"

export type ServiceType = "github" | "template" | null

interface DeployServiceWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeployServiceWizard({
  open,
  onOpenChange,
}: DeployServiceWizardProps) {
  const [step, setStep] = useState(1)
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const handleNext = () => {
    if (step === 1 && !serviceType) return
    if (step === 2 && serviceType === "template" && !selectedTemplate) return
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCancel = () => {
    setStep(1)
    setServiceType(null)
    setSelectedTemplate(null)
    onOpenChange(false)
  }

  const handleClose = () => {
    handleCancel()
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
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
        </div>

        <DeployWizardFooter
          currentStep={step}
          totalSteps={3}
          canGoNext={
            step === 1
              ? serviceType !== null
              : step === 2 && serviceType === "template"
                ? selectedTemplate !== null
                : true
          }
          onNext={handleNext}
          onBack={handleBack}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
