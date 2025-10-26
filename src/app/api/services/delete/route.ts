import { NextRequest, NextResponse } from "next/server"

interface ServiceDeleteInput {
  serviceId: string
  environmentId: string
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2"

const SERVICE_DELETE_MUTATION = `
  mutation serviceDelete($serviceId: String!, $environmentId: String!) {
    serviceDelete(
      id: $serviceId
      environmentId: $environmentId
    )
  }
`

export async function POST(request: NextRequest) {
  try {
    const apiToken = process.env.RAILWAY_API_TOKEN

    if (!apiToken) {
      return NextResponse.json(
        { error: "Railway API token is not configured" },
        { status: 500 }
      )
    }

    // Parse request body
    const body: ServiceDeleteInput = await request.json()

    // Validate required fields
    if (!body.serviceId || !body.environmentId) {
      return NextResponse.json(
        { error: "Missing required fields: serviceId, environmentId" },
        { status: 400 }
      )
    }

    // Call Railway.com GraphQL API
    const response = await fetch(RAILWAY_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        query: SERVICE_DELETE_MUTATION,
        variables: {
          serviceId: body.serviceId,
          environmentId: body.environmentId,
        },
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Railway API error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Handle GraphQL errors
    if (data.errors) {
      return NextResponse.json(
        { error: "GraphQL error", details: data.errors },
        { status: 400 }
      )
    }

    // Mutation returns boolean
    const deleteSuccess: boolean = data.data?.serviceDelete

    if (deleteSuccess === undefined || deleteSuccess === null) {
      return NextResponse.json(
        { error: "Invalid response format from service delete API" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      deleted: deleteSuccess,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    )
  }
}
