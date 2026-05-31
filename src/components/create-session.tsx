import { useState } from "react";
import Fab from "./fab";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Field, FieldGroup } from "./ui/field";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import { db } from "@/db/db";

export default function CreateSession() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const defaultDate = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(defaultDate);

  function handleOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) setDate(defaultDate);
  }

  async function handleNewSession(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    await db.sessions.add({ id: crypto.randomUUID(), date });
    setDialogOpen(false);
    setIsLoading(false);
    setDate(new Date().toISOString().slice(0, 10));
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Fab />
      </DialogTrigger>

      <DialogContent aria-describedby={undefined}>
        <form onSubmit={handleNewSession} className="contents">
          <DialogHeader>
            <DialogTitle>New session</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="date">Date</Label>

              <Input
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.currentTarget.value)}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner className="mr-1 size-4" />}
              Start
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
