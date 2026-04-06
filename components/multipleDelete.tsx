import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Switch } from "@/components/ui/switch";
import { Button } from "./ui/button";

interface MultipleDeleteProps {
  isSelectedMode: boolean;
  setSelectedMode: (isSelectedMode: boolean) => void;
  setSelected: ([]: any) => void;
  deleteSelected: () => void;
}

export default function MultipleDelete({
  isSelectedMode,
  setSelectedMode,
  setSelected,
  deleteSelected,
}: MultipleDeleteProps) {
  return (
    <div className="flex items-end justify-between py-2">
      <div className="flex items-center gap-1">
        <Switch
          checked={isSelectedMode}
          onClick={() => {
            setSelectedMode(!isSelectedMode);
            setSelected([]);
          }}
        />
        <p className="text-lg">Selecting mode</p>
      </div>
      <Button
        onClick={deleteSelected}
        variant="destructive"
        size="normal"
        className="flex items-center gap-1"
      >
        <HugeiconsIcon icon={Delete02Icon} />
        Delete
      </Button>
    </div>
  );
}
