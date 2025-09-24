import { Loader2Icon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center gap-10">
      <Loader2Icon className="mt-32 animate-spin md:mt-24" />
    </div>
  );
}
