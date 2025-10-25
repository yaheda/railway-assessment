"use client"

import { useMemo, useState } from "react"
import { Search, AlertCircle } from "lucide-react"
import { useTemplates, Template } from "@/hooks/useTemplates"
import { TemplateCard } from "./TemplateCard"

interface TemplateSelectorProps {
  selectedTemplateId: string | null
  onSelect: (template: Template) => void
}

export function TemplateSelector({
  selectedTemplateId,
  onSelect,
}: TemplateSelectorProps) {
  const { templates, isLoading, error } = useTemplates()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter templates based on search query
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) {
      return templates
    }

    const query = searchQuery.toLowerCase()
    return templates.filter(
      (template) =>
        template.name.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query)
    )
  }, [templates, searchQuery])

  // Find selected template
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId),
    [templates, selectedTemplateId]
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Select a Template</h2>
          <p className="text-muted-foreground text-sm">
            Choose a pre-built template to deploy
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
          <h2 className="text-lg font-semibold mb-2">Select a Template</h2>
          <p className="text-muted-foreground text-sm">
            Choose a pre-built template to deploy
          </p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Failed to load templates
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
        <h2 className="text-lg font-semibold mb-2">Select a Template</h2>
        <p className="text-muted-foreground text-sm">
          Choose a pre-built template to deploy
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates by name or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchQuery.trim()
              ? "No templates found matching your search"
              : "No templates available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Template count */}
      <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>
    </div>
  )
}
