
import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface DailyGoalDialogProps {
  trigger: React.ReactNode;
  initialGoal: number;
  onSetGoal: (goal: number) => void;
}

const DailyGoalDialog = ({ trigger, initialGoal, onSetGoal }: DailyGoalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(initialGoal.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(initialGoal.toString());
  }, [initialGoal, open]);

  const handleSave = () => {
    const goalNum = parseInt(value);
    if (!isNaN(goalNum) && goalNum > 0) {
      onSetGoal(goalNum);
      setOpen(false);
      setError(null);
    } else {
      setError("Please enter a valid positive number");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Daily Calorie Goal</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-2">
          <Input
            type="number"
            min={1}
            step={1}
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full"
            placeholder="Enter calorie goal"
            autoFocus
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyGoalDialog;
