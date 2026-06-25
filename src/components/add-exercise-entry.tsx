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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Spinner } from "./ui/spinner";
import Fab from "./fab";

const MAX_VISIBLE_ITEMS = 100;

type AddExerciseEntryProps = {
  sessionId: string;
  exercises: Exercise[];
};

export default function AddExerciseEntry({ sessionId, exercises }: AddExerciseEntryProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  function handleOpenChange(open: boolean) {
    setDialogOpen(open);
  }

  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 150);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = searchExercises(exercises, searchDebounced);
  const grouped = groupExercisesByMuscle(filtered.slice(0, MAX_VISIBLE_ITEMS));

  async function handleSelect(exerciseId: string) {
    const entries = await db.exerciseEntries.where("sessionId").equals(sessionId).toArray();
    const maxOrder = entries.reduce((max, entry) => Math.max(max, entry.order), 0);

    await db.exerciseEntries.add({
      id: crypto.randomUUID(),
      sessionId,
      exerciseId,
      order: maxOrder + 1,
    });

    handleOpenChange(false);
  }

  useEffect(() => {
    setSearch("");
    setSearchDebounced("");
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Fab />
      </DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add exercise</DialogTitle>
        </DialogHeader>

        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search exercises..."
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
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

        {search.length === 0 && (
          <div className="text-muted-foreground text-center text-xs">
            Type to search exercises...
          </div>
        )}

        {search.length > 0 && search !== searchDebounced && (
          <div className="flex justify-center">
            <Spinner />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
