import { NextRequest, NextResponse } from "next/server";

interface WorkflowStatusResponse {
  error?: string | null;
  status?: string;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const WORKFLOW_STATUS_QUERY = `
  query WorkflowStatus($workflowId: String!) {
    workflowStatus(workflowId: $workflowId) {
      error
      status
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const apiToken = process.env.RAILWAY_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { error: "Railway API token is not configured" },
        { status: 500 }
      );
    }

    // Get workflowId from query params
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        { error: "Missing required parameter: workflowId" },
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
        query: WORKFLOW_STATUS_QUERY,
        variables: {
          workflowId,
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

    // Extract workflow status response
    const statusResult: WorkflowStatusResponse = data.data?.workflowStatus;

    if (!statusResult) {
      return NextResponse.json(
        { error: "Invalid status response from Railway API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workflowId,
      status: statusResult.status,
      error: statusResult.error || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching workflow status:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow status" },
      { status: 500 }
    );
  }
}
