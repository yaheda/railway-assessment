"use client"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"

interface DeployWizardFooterProps {
  currentStep: number
  totalSteps: number
  canGoNext: boolean
  onNext: () => void
  onBack: () => void
  onCancel: () => void
}

export function DeployWizardFooter({
  currentStep,
  totalSteps,
  canGoNext,
  onNext,
  onBack,
  onCancel,
}: DeployWizardFooterProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps

  return (
    <DialogFooter className="pt-6 border-t mt-8">
      <div className="w-full flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          {!isFirstStep && (
            <Button
              variant="outline"
              onClick={onBack}
            >
              Back
            </Button>
          )}
          <Button
            onClick={onNext}
            disabled={!canGoNext}
          >
            {isLastStep ? "Deploy" : "Next"}
          </Button>
        </div>
      </div>
    </DialogFooter>
  )
}
