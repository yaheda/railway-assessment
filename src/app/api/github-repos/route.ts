import { NextResponse } from "next/server";

// Types for Railway API response
interface RailwayGithubRepo {
  fullName: string;
  name: string;
  description: string;
}

interface TransformedGithubRepo {
  fullName: string;
  name: string;
  description: string;
}

// Railway.com GraphQL API endpoint
const RAILWAY_GRAPHQL_URL = "https://backboard.railway.app/graphql/v2";

const GITHUB_REPOS_QUERY = `
  query GetGithubRepos {
    githubRepos {
      fullName
      name
      description
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
        query: GITHUB_REPOS_QUERY,
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

    // Transform and return repos data
    const rawRepos: RailwayGithubRepo[] = data.data?.githubRepos || [];

    const repos: TransformedGithubRepo[] = rawRepos.map((repo) => ({
      fullName: repo.fullName,
      name: repo.name,
      description: repo.description,
    }));

    return NextResponse.json({
      success: true,
      repos,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repositories" },
      { status: 500 }
    );
  }
}
