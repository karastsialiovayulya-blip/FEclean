"use client";
import { cn } from "@/lib/utils";

export default function BasePopup({
  children,
  setIsPopupOpen,
  width,
}: {
  children: React.ReactNode;
  setIsPopupOpen: (open: boolean) => void;
  width: string;
}) {
  return (
    <div
      onClick={() => setIsPopupOpen(false)}
      className="fixed inset-0 flex h-screen w-full items-center justify-center bg-gray-700/20 backdrop-blur-sm"
    >
      <div
        className={cn("max-h-80vh overflow-y-auto rounded-lg bg-white p-5", width)}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
