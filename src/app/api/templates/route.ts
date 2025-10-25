import { NextResponse } from "next/server";

// Types for Railway API response
interface RailwayTemplate {
  name: string;
  code: string;
  id: string;
  category: string;
  description: string;
  isVerified: boolean;
  serializedConfig?: string;
  isV2Template: boolean;
}

interface RailwayTemplateEdge {
  node: RailwayTemplate;
}

interface TransformedTemplate {
  name: string;
  code: string;
  id: string;
  category: string;
  description: string;
  isVerified: boolean;
  serializedConfig?: string;
  isV2Template: boolean;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const TEMPLATES_QUERY = `
  query GetTemplates {
    templates {
      edges {
        node {
          name
          code
          id
          category
          description
          isVerified
          serializedConfig
          isV2Template
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
        query: TEMPLATES_QUERY,
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

    // Transform and return templates data
    const rawTemplateEdges: RailwayTemplateEdge[] =
      data.data?.templates?.edges || [];

    const templates: TransformedTemplate[] = rawTemplateEdges.map(
      (edge) => ({
        name: edge.node.name,
        code: edge.node.code,
        id: edge.node.id,
        category: edge.node.category,
        description: edge.node.description,
        isVerified: edge.node.isVerified,
        serializedConfig: edge.node.serializedConfig,
        isV2Template: edge.node.isV2Template,
      })
    );

    return NextResponse.json({
      success: true,
      templates,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
