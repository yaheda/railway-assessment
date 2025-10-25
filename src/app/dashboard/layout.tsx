"use client";

import { Sidebar } from "./components/Sidebar";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useAutoSelectWorkspaceHierarchy } from "@/hooks/useAutoSelectWorkspaceHierarchy";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaces, isLoading } = useWorkspaces();

  // Auto-select first workspace, project, and environment on mount
  useAutoSelectWorkspaceHierarchy({
    workspaces,
    isLoading,
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
