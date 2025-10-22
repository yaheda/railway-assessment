"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Settings,
  Menu,
  X,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaces } from "@/hooks/useWorkspaces";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { workspaces, isLoading, error, refetch } = useWorkspaces();
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  // Set initial workspace when data loads
  const currentWorkspaceName =
    selectedWorkspace || workspaces[0]?.name || "No workspaces";

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg hover:bg-secondary/20"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border transition-transform duration-300 z-30",
          "md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo area */}
        <div className="px-6 py-8 border-b border-border space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">Railway</span>
          </Link>

          {/* Workspace Dropdown */}
          <div>
            <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-2">
              Workspace
            </p>

            {error ? (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-destructive bg-destructive/10 rounded-lg">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span className="truncate">{error}</span>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={isLoading || workspaces.length === 0}
                  >
                    <span className="truncate">
                      {isLoading ? "Loading..." : currentWorkspaceName}
                    </span>
                    <ChevronDown size={16} className="ml-2 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => setSelectedWorkspace(workspace.name)}
                      className="cursor-pointer"
                    >
                      {workspace.name}
                      {currentWorkspaceName === workspace.name && (
                        <span className="ml-auto text-primary">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                  {workspaces.length > 0 && (
                    <>
                      <div className="my-1 border-t border-border" />
                      <DropdownMenuItem
                        onClick={() => refetch()}
                        className="cursor-pointer text-xs"
                      >
                        Refresh workspaces
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Navigation items */}
        <nav className="px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/70 hover:bg-secondary/10 hover:text-foreground"
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <UserButton afterSignOutUrl="/" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Account</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
