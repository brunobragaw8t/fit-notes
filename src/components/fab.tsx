import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export default function Fab({ ...props }: React.ComponentProps<typeof Button>) {
  // env(safe-area-inset-bottom) = device safe bottom area
  // 4rem = Dock height
  // 1rem = main padding

  return (
    <Button
      size="icon-lg"
      className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+4rem+1rem)]"
      {...props}
    >
      <Plus />
    </Button>
  );
}
