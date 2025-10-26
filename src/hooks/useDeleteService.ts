import { useCallback, useState } from "react"

export interface ServiceDeleteInput {
  serviceId: string
  environmentId: string
}

interface UseDeleteServiceReturn {
  deleteService: (input: ServiceDeleteInput) => Promise<void>
  isLoading: boolean
  error: string | null
}

/**
 * Hook to delete a service from an environment
 * Calls the serviceDelete mutation via the API route
 */
export function useDeleteService(): UseDeleteServiceReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteService = useCallback(
    async (input: ServiceDeleteInput): Promise<void> => {
      try {
        setError(null)
        setIsLoading(true)

        const response = await fetch("/api/services/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          )
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error("Failed to delete service")
        }

        if (!data.deleted) {
          throw new Error("Service deletion did not complete successfully")
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete service"
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return { deleteService, isLoading, error }
}
