import { db } from "@/db/db";
import type { Exercise } from "@/db/types";
import { groupExercisesByMuscle } from "@/lib/group-exercises-by-muscle";
import { searchExercises } from "@/lib/search-exercises";
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
import { Spinner } from "./ui/spinner";

const MAX_VISIBLE_ITEMS = 100;

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
  const [searchDebounced, setSearchDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = searchExercises(exercises, searchDebounced);
  const grouped = groupExercisesByMuscle(filtered.slice(0, MAX_VISIBLE_ITEMS));

  async function handleSelect(exerciseId: string) {
    const count = await db.exerciseEntries.where("sessionId").equals(sessionId).count();
    await db.exerciseEntries.add({
      id: crypto.randomUUID(),
      sessionId,
      exerciseId,
      order: count,
      sets: [],
    });

    onOpenChange(false);
  }

  useEffect(() => {
    setSearch("");
    setSearchDebounced("");
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

        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search exercises..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            {search.length === 0 && (
              <div className="text-muted-foreground py-4 text-center text-sm">
                Type to search exercises...
              </div>
            )}

            {search.length > 0 && search !== searchDebounced && (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            )}

            {search.length > 0 && search === searchDebounced && filtered.length === 0 && (
              <CommandEmpty>No exercises found.</CommandEmpty>
            )}

            {search.length > 0 &&
              search === searchDebounced &&
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
