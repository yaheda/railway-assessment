import { NextResponse } from "next/server";

// Railway.com GraphQL API endpoint
//const RAILWAY_GRAPHQL_URL = "https://api.railway.app/graphql";
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

// TODO: Replace with actual Railway.com workspace query
// This is a placeholder - provide your actual GraphQL query
const WORKSPACES_QUERY = `
  query GetWorkspaces {
    me {
      workspaces {
        id
        name
        projects {
          edges {
            node {
              name
              id
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    const apiToken = process.env.RAILWAY_API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        { error: "Railway API token is not configured" },
        { status: 500 }
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
        query: WORKSPACES_QUERY,
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

    // Transform and return workspace data
    const workspaces = data.data?.me.workspaces || [];

    return NextResponse.json({
      success: true,
      workspaces,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}
