"use client"

import { useMemo, useState } from "react"
import { Search, AlertCircle } from "lucide-react"
import { useGithubRepos, GithubRepo } from "@/hooks/useGithubRepos"
import { GitHubRepoCard } from "./GitHubRepoCard"

interface GitHubRepoSelectorProps {
  selectedRepoFullName: string | null
  onSelect: (repo: GithubRepo) => void
}

export function GitHubRepoSelector({
  selectedRepoFullName,
  onSelect,
}: GitHubRepoSelectorProps) {
  const { repos, isLoading, error } = useGithubRepos()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter repos based on search query
  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) {
      return repos
    }

    const query = searchQuery.toLowerCase()
    return repos.filter(
      (repo) =>
        repo.name.toLowerCase().includes(query) ||
        repo.fullName.toLowerCase().includes(query) ||
        repo.description.toLowerCase().includes(query)
    )
  }, [repos, searchQuery])

  // Find selected repo
  const selectedRepo = useMemo(
    () => repos.find((r) => r.fullName === selectedRepoFullName),
    [repos, selectedRepoFullName]
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Select a GitHub Repository</h2>
          <p className="text-muted-foreground text-sm">
            Choose a repository to deploy from
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Select a GitHub Repository</h2>
          <p className="text-muted-foreground text-sm">
            Choose a repository to deploy from
          </p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Failed to load repositories
            </p>
            <p className="text-xs text-red-600/70 dark:text-red-300/70 mt-1">
              {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Select a GitHub Repository</h2>
        <p className="text-muted-foreground text-sm">
          Choose a repository to deploy from
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search repositories by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Repositories Grid */}
      {filteredRepos.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery.trim()
              ? "No repositories found matching your search"
              : "No repositories available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredRepos.map((repo) => (
            <GitHubRepoCard
              key={repo.fullName}
              repo={repo}
              isSelected={selectedRepo?.fullName === repo.fullName}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Repository count */}
      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        Showing {filteredRepos.length} of {repos.length} repositories
      </div>
    </div>
  )
}
