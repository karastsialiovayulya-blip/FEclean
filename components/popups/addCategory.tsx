import { startTransition, useActionState, useEffect } from "react";
import { createServiceCategoryAPI } from "@/lib/api/actions/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BasePopup from "./basePopup";

export default function AddCategory({
  setIsPopupOpen,
}: {
  setIsPopupOpen: (open: boolean) => void;
}) {
  const [state, action, isPending] = useActionState(createServiceCategoryAPI, null);

  const OnSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const dataToSend = {
      name: formData.get("name"),
    };

    startTransition(() => {
      action(dataToSend);
    });
  };

  useEffect(() => {
    if (state?.success) setIsPopupOpen(false);
  }, [state]);

  return (
    <BasePopup
      setIsPopupOpen={setIsPopupOpen}
      width="w-[20%]"
    >
      <form
        onSubmit={OnSubmit}
        className="flex w-full flex-col gap-4"
      >
        <h3>Set new category name</h3>
        <Input
          name="name"
          required
        />
        <Button
          size="normal"
          type="submit"
          disabled={isPending}
        >
          Create
        </Button>
      </form>
    </BasePopup>
  );
}
