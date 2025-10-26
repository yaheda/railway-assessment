"use client"

import { useEffect } from "react"
import { CheckCircle } from "lucide-react"

interface DeploymentSuccessProps {
  workflowId?: string | null
  templateName?: string
  serviceId?: string
  serviceName?: string
  onSuccess?: () => void
  autoCloseDelay?: number
  isGithubDeploy?: boolean
}

export function DeploymentSuccess({
  workflowId,
  templateName,
  serviceId,
  serviceName,
  onSuccess,
  autoCloseDelay = 2500,
  isGithubDeploy = false,
}: DeploymentSuccessProps) {
  const displayName = isGithubDeploy ? serviceName : templateName

  // Auto-close after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSuccess) {
        onSuccess()
      }
    }, autoCloseDelay)

    return () => clearTimeout(timer)
  }, [onSuccess, autoCloseDelay])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Deployment Initiated</h2>
        <p className="text-muted-foreground text-sm">
          Your deployment has been successfully sent to Railway
        </p>
      </div>

      {/* Success Card */}
      <div className="border border-green-500/20 rounded-lg p-6 bg-green-500/10">
        <div className="flex items-center gap-4">
          <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
              Success!
            </h3>
            <p className="text-sm text-green-600/70 dark:text-green-300/70 mt-1">
              {isGithubDeploy
                ? `${displayName} service has been created successfully`
                : `${displayName} is being deployed to your environment`}
            </p>
          </div>
        </div>
      </div>

      {/* Workflow ID Card */}
      {workflowId && !isGithubDeploy && (
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Workflow ID</p>
          <p className="font-mono text-sm bg-secondary/20 px-3 py-2 rounded break-all">
            {workflowId}
          </p>
        </div>
      )}

      {/* Service ID Card */}
      {serviceId && isGithubDeploy && (
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-sm text-muted-foreground mb-2">Service ID</p>
          <p className="font-mono text-sm bg-secondary/20 px-3 py-2 rounded break-all">
            {serviceId}
          </p>
        </div>
      )}

      {/* Info Message */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
          Closing in a moment...
        </p>
        <p className="text-xs text-blue-600/70 dark:text-blue-300/70 mt-1">
          The wizard will close and your services list will update automatically.
        </p>
      </div>
    </div>
  )
}
