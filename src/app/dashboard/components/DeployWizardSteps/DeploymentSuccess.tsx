"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useWorkflowStatus } from "@/hooks/useDeploy"

interface DeploymentSuccessProps {
  workflowId: string
  templateName: string
  onSuccess?: () => void
  autoCloseDelay?: number
}

type WorkflowStatusType = "PENDING" | "SUCCESS" | "FAILED" | "IN_PROGRESS" | null

export function DeploymentSuccess({
  workflowId,
  templateName,
  onSuccess,
  autoCloseDelay = 3000,
}: DeploymentSuccessProps) {
  const { checkStatus } = useWorkflowStatus()
  const [status, setStatus] = useState<WorkflowStatusType>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    let isMounted = true

    const pollStatus = async () => {
      try {
        setError(null)
        const result = await checkStatus(workflowId)

        if (!isMounted) return

        const currentStatus = result.status?.toUpperCase() as WorkflowStatusType

        setStatus(currentStatus)

        // Stop polling if status is terminal
        if (currentStatus === "SUCCESS" || currentStatus === "FAILED") {
          setIsChecking(false)
          if (interval) clearInterval(interval)

          // Auto-close on success
          if (currentStatus === "SUCCESS" && onSuccess) {
            setTimeout(() => {
              onSuccess()
            }, autoCloseDelay)
          }
        }
      } catch (err) {
        if (!isMounted) return
        const errorMessage =
          err instanceof Error ? err.message : "Failed to check deployment status"
        setError(errorMessage)
        setIsChecking(false)
      }
    }

    // Initial check
    pollStatus()

    // Poll every 2 seconds
    interval = setInterval(pollStatus, 2000)

    return () => {
      isMounted = false
      if (interval) clearInterval(interval)
    }
  }, [workflowId, checkStatus, onSuccess, autoCloseDelay])

  const isSuccess = status === "SUCCESS"
  const isFailed = status === "FAILED"
  const isDeploying =
    status === "IN_PROGRESS" || status === "PENDING" || isChecking

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Deployment Status</h2>
        <p className="text-muted-foreground text-sm">
          Monitoring the deployment of {templateName}
        </p>
      </div>

      {/* Status Card */}
      <div className="border border-border rounded-lg p-6 bg-card">
        <div className="flex items-center gap-4">
          {isSuccess && (
            <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
          )}
          {isFailed && (
            <AlertCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
          )}
          {isDeploying && (
            <div className="w-12 h-12 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin flex-shrink-0" />
          )}

          <div className="flex-1">
            {isSuccess && (
              <>
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                  Deployment Successful!
                </h3>
                <p className="text-sm text-green-600/70 dark:text-green-300/70 mt-1">
                  Your service has been deployed successfully
                </p>
              </>
            )}

            {isFailed && (
              <>
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                  Deployment Failed
                </h3>
                <p className="text-sm text-red-600/70 dark:text-red-300/70 mt-1">
                  There was an issue deploying your service
                </p>
              </>
            )}

            {isDeploying && (
              <>
                <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-400">
                  Deploying...
                </h3>
                <p className="text-sm text-yellow-600/70 dark:text-yellow-300/70 mt-1">
                  Your deployment is in progress. This may take a few moments.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Workflow ID Card */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <p className="text-sm text-muted-foreground mb-2">Workflow ID</p>
        <p className="font-mono text-sm bg-secondary/20 px-3 py-2 rounded break-all">
          {workflowId}
        </p>
      </div>

      {/* Status Details */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          {isSuccess && <CheckCircle className="w-4 h-4 text-green-500" />}
          {isFailed && <AlertCircle className="w-4 h-4 text-red-500" />}
          {isDeploying && <Clock className="w-4 h-4 text-yellow-500" />}
          <span>Current Status</span>
        </h3>
        <p className="text-sm">
          {status === "SUCCESS" && (
            <span className="text-green-700 dark:text-green-400 font-medium">
              Successfully deployed
            </span>
          )}
          {status === "FAILED" && (
            <span className="text-red-700 dark:text-red-400 font-medium">
              Deployment failed
            </span>
          )}
          {(status === "IN_PROGRESS" || status === "PENDING") && (
            <span className="text-yellow-700 dark:text-yellow-400 font-medium">
              {status === "PENDING" ? "Pending" : "In progress"}
            </span>
          )}
          {isChecking && !status && (
            <span className="text-muted-foreground">Checking status...</span>
          )}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Error checking deployment status
            </p>
            <p className="text-xs text-red-600/70 dark:text-red-300/70 mt-1">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Info Message */}
      {isSuccess && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 flex gap-3">
          <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
              Closing shortly
            </p>
            <p className="text-xs text-blue-600/70 dark:text-blue-300/70 mt-1">
              This dialog will close automatically. Your new service will appear
              in the services list.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
