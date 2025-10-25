"use client"

import { Github, Zap } from "lucide-react"
import { ServiceType } from "../DeployServiceWizard"

interface ServiceTypeSelectorProps {
  selectedType: ServiceType
  onSelect: (type: ServiceType) => void
}

export function ServiceTypeSelector({
  selectedType,
  onSelect,
}: ServiceTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">How do you want to deploy?</h2>
        <p className="text-muted-foreground text-sm">
          Choose the source for your new service deployment
        </p>
      </div>

      <div className="space-y-3">
        {/* GitHub Repo Option */}
        <button
          onClick={() => onSelect("github")}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
            selectedType === "github"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 bg-background"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg flex-shrink-0 ${
                selectedType === "github"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <Github className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">Deploy from GitHub Repository</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Connect your GitHub repository and deploy directly from your code
              </p>
            </div>
          </div>
        </button>

        {/* Template Option */}
        <button
          onClick={() => onSelect("template")}
          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
            selectedType === "template"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 bg-background"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg flex-shrink-0 ${
                selectedType === "template"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">Deploy from Template</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Choose from pre-built templates to quickly deploy a new service
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
