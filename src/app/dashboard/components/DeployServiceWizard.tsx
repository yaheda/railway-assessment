"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ServiceTypeSelector } from "./DeployWizardSteps/ServiceTypeSelector"
import { DeployWizardFooter } from "./DeployWizardFooter"

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

  const handleNext = () => {
    if (step === 1 && !serviceType) return
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
    onOpenChange(false)
  }

  const handleClose = () => {
    handleCancel()
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
        </div>

        <DeployWizardFooter
          currentStep={step}
          totalSteps={2}
          canGoNext={step === 1 ? serviceType !== null : true}
          onNext={handleNext}
          onBack={handleBack}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
