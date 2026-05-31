import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <>
      <div
        role="status"
        aria-label="Loading"
        className={cn(
          "border-current/30 border-t-current size-6 animate-spin rounded-full border-2",
          className,
        )}
        {...props}
      />
    </>
  );
}

export { Spinner };
