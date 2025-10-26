import { NextRequest, NextResponse } from "next/server";

interface ServiceInstanceDeployInput {
  serviceId: string;
  environmentId: string;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const SERVICE_INSTANCE_DEPLOY_MUTATION = `
  mutation serviceInstanceDeployV2($serviceId: String!, $environmentId: String!) {
    serviceInstanceDeployV2(
      serviceId: $serviceId
      environmentId: $environmentId
    )
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
    const body: ServiceInstanceDeployInput = await request.json();

    // Validate required fields
    if (!body.serviceId || !body.environmentId) {
      return NextResponse.json(
        { error: "Missing required fields: serviceId, environmentId" },
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
        query: SERVICE_INSTANCE_DEPLOY_MUTATION,
        variables: {
          serviceId: body.serviceId,
          environmentId: body.environmentId,
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

    // Mutation returns boolean
    const deploySuccess: boolean = data.data?.serviceInstanceDeployV2;

    if (deploySuccess === undefined || deploySuccess === null) {
      return NextResponse.json(
        { error: "Invalid response format from service instance deploy API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deployed: deploySuccess,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deploying service instance:", error);
    return NextResponse.json(
      { error: "Failed to deploy service instance" },
      { status: 500 }
    );
  }
}
