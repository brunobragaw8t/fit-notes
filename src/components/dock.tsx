import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { CalendarDays, Dumbbell, type LucideIcon } from "lucide-react";

export default function Dock() {
  const { pathname } = useLocation();

  const items = [
    {
      path: "/sessions",
      label: "Sessions",
      icon: CalendarDays,
    },
    {
      path: "/exercises",
      label: "Exercises",
      icon: Dumbbell,
    },
  ];

  return (
    <nav>
      <div className="via-muted h-px bg-linear-to-r from-transparent to-transparent" />

      <div className="flex items-center justify-around px-6">
        {items.map(({ path, label, icon }) => (
          <DockTab key={path} to={path} active={pathname === path} icon={icon} label={label} />
        ))}
      </div>
    </nav>
  );
}

function DockTab({
  to,
  active,
  icon: Icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "relative flex flex-col items-center gap-1 px-6 pt-4 pb-2 transition-all",
        active ? "text-primary-foreground" : "text-muted-foreground",
      )}
    >
      {active && (
        <div className="bg-primary absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full" />
      )}

      <Icon size={20} />

      <span className="text-xs">{label}</span>
    </Link>
  );
}
