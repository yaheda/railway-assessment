import { NextResponse } from "next/server";

// Types for Railway API response
interface RailwayEnvironment {
  name: string;
  serviceInstances?: {
    edges: Array<{
      node: {
        serviceName: string;
        source?: {
          image?: string;
          repo?: string;
        };
      };
    }>;
  };
}

interface RailwayEnvironmentEdge {
  node: RailwayEnvironment;
}

interface RailwayProject {
  id: string;
  name: string;
  environments?: {
    edges: RailwayEnvironmentEdge[];
  };
}

interface RailwayProjectEdge {
  node: RailwayProject;
}

interface RailwayWorkspace {
  id: string;
  name: string;
  projects: {
    edges: RailwayProjectEdge[];
  };
}

interface TransformedEnvironment {
  id: string;
  name: string;
}

interface TransformedProject {
  id: string;
  name: string;
  environments: TransformedEnvironment[];
}

interface TransformedWorkspace {
  id: string;
  name: string;
  projects: TransformedProject[];
}

// Railway.com GraphQL API endpoint
//const RAILWAY_GRAPHQL_URL = "https://api.railway.app/graphql";
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

// TODO: Replace with actual Railway.com workspace query
// This is a placeholder - provide your actual GraphQL query
const WORKSPACES_QUERY = `
  query GetWorkspaces {
    me {
      workspaces {
        name
        projects {
          edges {
            node {
              name
              id
              environments {
                edges {
                  node {
                    name
                    serviceInstances {
                      edges {
                        node {
                          serviceName
                          source {
                            image
                            repo
                          }
                          createdAt
                          latestDeployment {
                            status
                          }
                        }
                      }
                    }
                  }
                }
              }
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
    const rawWorkspaces: RailwayWorkspace[] = data.data?.me?.workspaces || [];

    const workspaces: TransformedWorkspace[] = rawWorkspaces.map((ws) => ({
      id: ws.id,
      name: ws.name,
      projects: (ws.projects?.edges || []).map((edge) => ({
        id: edge.node.id,
        name: edge.node.name,
        environments: (edge.node.environments?.edges || []).map((envEdge, index) => ({
          id: `${edge.node.id}-env-${index}-${envEdge.node.name.toLowerCase().replace(/\s+/g, "-")}`,
          name: envEdge.node.name,
        })),
      })),
    }));

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
