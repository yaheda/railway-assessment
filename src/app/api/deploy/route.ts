import { NextRequest, NextResponse } from "next/server";

interface DeploymentInput {
  workspaceId: string;
  templateId: string;
  serializedConfig: Record<string, unknown>;
  projectId: string;
  environmentId: string;
}

interface RailwayDeployResponse {
  workflowId: string;
  projectId: string;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const TEMPLATE_DEPLOY_MUTATION = `
  mutation TemplateDeployV2($input: TemplateDeployV2Input!) {
    templateDeployV2(input: $input) {
      workflowId
      projectId
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
    const body: DeploymentInput = await request.json();

    // Validate required fields
    if (
      !body.workspaceId ||
      !body.templateId ||
      !body.projectId ||
      !body.environmentId
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields: workspaceId, templateId, projectId, environmentId",
        },
        { status: 400 }
      );
    }
    debugger;
    // Call Railway.com GraphQL API
    const response = await fetch(RAILWAY_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        query: TEMPLATE_DEPLOY_MUTATION,
        variables: {
          input: {
            workspaceId: body.workspaceId,
            templateId: body.templateId,
            serializedConfig: body.serializedConfig || {},
            projectId: body.projectId,
            environmentId: body.environmentId,
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

    // Extract deployment response
    const deploymentResult: RailwayDeployResponse =
      data.data?.templateDeployV2;

    if (!deploymentResult || !deploymentResult.workflowId) {
      return NextResponse.json(
        { error: "Invalid deployment response from Railway API" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      workflowId: deploymentResult.workflowId,
      projectId: deploymentResult.projectId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deploying template:", error);
    return NextResponse.json(
      { error: "Failed to deploy template" },
      { status: 500 }
    );
  }
}
