import { NextRequest, NextResponse } from "next/server";

interface EnvironmentStagedChange {
  id: string;
  status: string;
  lastAppliedError: string | null;
}

interface StagedChangesInput {
  environmentId: string;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const STAGED_CHANGES_QUERY = `
  query GetEnvironmentStagedChanges($id: String!) {
    environmentStagedChanges(environmentId: $id) {
      id
      status
      lastAppliedError
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
    const body: StagedChangesInput = await request.json();

    // Validate required fields
    if (!body.environmentId) {
      return NextResponse.json(
        { error: "Missing required field: environmentId" },
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
        query: STAGED_CHANGES_QUERY,
        variables: {
          id: body.environmentId,
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

    // Extract staged changes response (can be null if no pending changes)
    let stagedChanges: EnvironmentStagedChange | null =
      data.data?.environmentStagedChanges || null;

    // Filter out stages with id "<empty>"
    if (stagedChanges !== null) {
      if (stagedChanges.id === "<empty>") {
        stagedChanges = null;
      }
    }

    return NextResponse.json({
      success: true,
      stagedChanges,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching environment staged changes:", error);
    return NextResponse.json(
      { error: "Failed to fetch environment staged changes" },
      { status: 500 }
    );
  }
}
