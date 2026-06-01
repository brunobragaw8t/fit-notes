import { db } from "@/db/db";
import type { Exercise } from "@/db/types";
import { searchAndGroupExercises } from "@/lib/group-exercises-by-muscle";
import { useEffect, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

type AddExerciseModalProps = {
  sessionId: string;
  exercises: Exercise[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddExerciseModal({
  sessionId,
  exercises,
  open,
  onOpenChange,
}: AddExerciseModalProps) {
  const [search, setSearch] = useState("");

  const searchLower = search.toLowerCase();
  const grouped = searchAndGroupExercises(exercises, searchLower);

  async function handleSelect(exerciseId: string) {
    await db.exerciseEntries.add({
      id: crypto.randomUUID(),
      sessionId,
      exerciseId,
      sets: [],
    });

    onOpenChange(false);
  }

  useEffect(() => {
    setSearch("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0"
        aria-describedby={undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Add exercise</DialogTitle>
        </DialogHeader>

        <Command>
          <CommandInput
            placeholder="Search exercises..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No exercises found.</CommandEmpty>

            {grouped &&
              Object.entries(grouped).map(([group, items]) => (
                <CommandGroup key={group} heading={group}>
                  {items.map((ex) => (
                    <CommandItem key={ex.id} value={ex.id} onSelect={() => handleSelect(ex.id)}>
                      {ex.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
