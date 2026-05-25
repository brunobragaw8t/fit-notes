import Dock from "@/components/dock";
import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="flex h-screen flex-col">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      <Dock />
    </div>
  ),
});
