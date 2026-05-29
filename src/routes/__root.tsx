import Dock from "@/components/dock";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto p-4">
        <Outlet />
      </main>

      <Dock />
    </div>
  ),
});
