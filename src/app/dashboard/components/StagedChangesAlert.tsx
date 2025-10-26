"use client"

import { useState } from "react"
import { AlertCircle, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnvironmentStagedChange } from "@/hooks/useEnvironmentStagedChanges"

interface StagedChangesAlertProps {
  stagedChanges: EnvironmentStagedChange
  onDeploy: () => Promise<void>
  isDeploying?: boolean
}

export function StagedChangesAlert({
  stagedChanges,
  onDeploy,
  isDeploying = false,
}: StagedChangesAlertProps) {
  const [localError, setLocalError] = useState<string | null>(null)
  const isPending = stagedChanges.status === "PENDING"

  const handleDeploy = async () => {
    try {
      setLocalError(null)
      await onDeploy()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to deploy changes"
      setLocalError(errorMessage)
    }
  }

  return (
    <div
      className={`rounded-lg border p-4 flex items-start gap-4 ${
        isPending
          ? "border-orange-500/30 bg-orange-500/10"
          : "border-yellow-500/30 bg-yellow-500/10"
      }`}
    >
      <AlertCircle
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
          isPending ? "text-orange-500" : "text-yellow-500"
        }`}
      />

      <div className="flex-1 min-w-0">
        <h3
          className={`font-semibold text-sm ${
            isPending
              ? "text-orange-700 dark:text-orange-400"
              : "text-yellow-700 dark:text-yellow-400"
          }`}
        >
          Environment Changes Pending Deployment
        </h3>
        <p
          className={`text-xs mt-1 ${
            isPending
              ? "text-orange-600/70 dark:text-orange-300/70"
              : "text-yellow-600/70 dark:text-yellow-300/70"
          }`}
        >
          {isPending
            ? "Your environment has pending changes that need to be deployed to take effect."
            : `Status: ${stagedChanges.status}`}
        </p>

        {stagedChanges.lastAppliedError && (
          <p
            className={`text-xs mt-2 ${
              isPending
                ? "text-orange-600/70 dark:text-orange-300/70"
                : "text-yellow-600/70 dark:text-yellow-300/70"
            }`}
          >
            <span className="font-medium">Last error:</span>{" "}
            {stagedChanges.lastAppliedError}
          </p>
        )}

        {localError && (
          <p className="text-xs mt-2 text-red-600/70 dark:text-red-300/70">
            <span className="font-medium">Deployment error:</span> {localError}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDeploy}
            disabled={isDeploying}
            className="gap-1.5"
          >
            {isDeploying ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Zap size={14} />
                Deploy Changes
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            Change ID: <code className="text-xs">{stagedChanges.id}</code>
          </p>
        </div>
      </div>
    </div>
  )
}
