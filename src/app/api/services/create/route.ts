import { NextRequest, NextResponse } from "next/server";

interface ServiceCreateInput {
  projectId: string;
  environmentId: string;
  name: string;
  repo: string;
  image: string;
}

interface ServiceCreateResponse {
  id: string;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const SERVICE_CREATE_MUTATION = `
  mutation ServiceCreate($input: ServiceCreateInput!) {
    serviceCreate(input: $input) {
      id
    }
  }
`;

export async function POST(request: NextRequest) {
  try {
    const apiToken = process.env.RAILWAY_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { error: "Railway API token is not configured" },
        { status: 500 }
      );
    }

    // Parse request body
    const body: ServiceCreateInput = await request.json();

    // Validate required fields
    if (!body.projectId || !body.environmentId || !body.name) {
      return NextResponse.json(
        {
          error: "Missing required fields: projectId, environmentId, name",
        },
        { status: 400 }
      );
    }

    // Call Railway.com GraphQL API
    const response = await fetch(RAILWAY_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        query: SERVICE_CREATE_MUTATION,
        variables: {
          input: {
            projectId: body.projectId,
            environmentId: body.environmentId,
            name: body.name,
            source: body.repo ? {
              repo: body.repo,
            } : body.image ? {
              image: body.image,
            } : undefined,
          },
        },
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Railway API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Handle GraphQL errors
    if (data.errors) {
      return NextResponse.json(
        { error: "GraphQL error", details: data.errors },
        { status: 400 }
      );
    }

    // Extract service creation response
    const serviceResult: ServiceCreateResponse = data.data?.serviceCreate;

    if (!serviceResult || !serviceResult.id) {
      return NextResponse.json(
        { error: "Invalid service creation response from Railway API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      serviceId: serviceResult.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
