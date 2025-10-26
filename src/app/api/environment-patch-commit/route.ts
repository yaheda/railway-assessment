import { NextRequest, NextResponse } from "next/server";

interface EnvironmentPatchCommitInput {
  environmentId: string;
  commitMessage?: string;
  skipDeploys?: boolean;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const PATCH_COMMIT_MUTATION = `
  mutation environmentPatchCommitStaged($environmentId: String!, $message: String, $skipDeploys: Boolean) {
    environmentPatchCommitStaged(
      environmentId: $environmentId
      commitMessage: $message
      skipDeploys: $skipDeploys
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
    const body: EnvironmentPatchCommitInput = await request.json();

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
        query: PATCH_COMMIT_MUTATION,
        variables: {
          environmentId: body.environmentId,
          message: body.commitMessage || "Deployed from Railway Assessment",
          skipDeploys: body.skipDeploys ?? false,
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

    // Extract patch commit response (returns boolean)
    const success: boolean = data.data?.environmentPatchCommitStaged;

    if (success === undefined || success === null) {
      return NextResponse.json(
        { error: "Invalid response format from patch commit API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      committed: success,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error committing staged changes:", error);
    return NextResponse.json(
      { error: "Failed to commit staged changes" },
      { status: 500 }
    );
  }
}
