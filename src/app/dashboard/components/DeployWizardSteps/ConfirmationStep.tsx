"use client"

import { AlertCircle } from "lucide-react"
import { Template } from "@/hooks/useTemplates"
import { GithubRepo } from "@/hooks/useGithubRepos"

interface ConfirmationStepProps {
  template?: Template
  githubRepo?: GithubRepo
  workspaceName: string
  projectName: string
  environmentName: string
  isDeploying?: boolean
}

export function ConfirmationStep({
  template,
  githubRepo,
  workspaceName,
  projectName,
  environmentName,
  isDeploying = false,
}: ConfirmationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Ready to Deploy</h2>
        <p className="text-muted-foreground text-sm">
          Review the details below and click Deploy to start the deployment
        </p>
      </div>

      {/* Template Summary Card */}
      {template && (
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Template Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Template Name</p>
                <p className="text-base font-medium mt-1">{template.name}</p>
              </div>
              {template.isVerified && (
                <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 text-xs rounded font-medium">
                  Verified
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-sm font-medium mt-1">{template.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="text-xs font-mono bg-secondary/20 px-2 py-1 rounded mt-1 w-fit">
                  {template.code}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-sm mt-1 text-foreground">
                {template.description || "No description available"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Repository Summary Card */}
      {githubRepo && (
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Repository Details
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Repository Name</p>
              <p className="text-base font-medium mt-1">{githubRepo.name}</p>
            </div>

            <div className="pt-2 border-t border-border/50">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="text-xs font-mono bg-secondary/20 px-2 py-1 rounded mt-1 w-fit">
                {githubRepo.fullName}
              </p>
            </div>

            {githubRepo.description && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm mt-1 text-foreground">
                  {githubRepo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deployment Target Card */}
      <div className="border border-border rounded-lg p-4 bg-card">
        <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          Deployment Target
        </h3>

        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Workspace</p>
              <p className="text-sm font-medium mt-1">{workspaceName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Project</p>
              <p className="text-sm font-medium mt-1">{projectName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Environment</p>
              <p className="text-sm font-medium mt-1">{environmentName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Deployment in progress
          </p>
          <p className="text-xs text-blue-600/70 dark:text-blue-300/70 mt-1">
            Click the Deploy button to begin the deployment. You&apos;ll see the
            status in the next step.
          </p>
        </div>
      </div>

      {isDeploying && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4 flex gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Deploying...
            </p>
            <p className="text-xs text-yellow-600/70 dark:text-yellow-300/70 mt-1">
              Sending deployment request to Railway
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
