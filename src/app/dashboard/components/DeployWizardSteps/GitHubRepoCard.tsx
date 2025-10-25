"use client"

import { GithubRepo } from "@/hooks/useGithubRepos"
import { Github, Check } from "lucide-react"

interface GitHubRepoCardProps {
  repo: GithubRepo
  isSelected: boolean
  onSelect: (repo: GithubRepo) => void
}

export function GitHubRepoCard({
  repo,
  isSelected,
  onSelect,
}: GitHubRepoCardProps) {
  return (
    <button
      onClick={() => onSelect(repo)}
      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-background"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`p-2 rounded-lg flex-shrink-0 ${
            isSelected
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <Github className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-sm text-foreground truncate">
                {repo.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {repo.fullName}
              </p>
            </div>
            {isSelected && (
              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            )}
          </div>

          {/* Description */}
          {repo.description && (
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
