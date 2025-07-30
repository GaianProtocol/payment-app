// Component: Renders progress steps
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, RefreshCw, X } from "lucide-react";

const Steps = [1, 2];

export function ProgressSteps({
  stepProgress,
  failStep,
}: {
  stepProgress: number;
  failStep: number;
}) {
  return (
    <div className="py-2 min-h-full self-stretch flex flex-col">
      {Steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col items-center",
            index === Steps.length - 1 ? "" : "flex-1"
          )}
        >
          <div
            className={cn(
              "rounded-full w-6 h-6 flex justify-center items-center text-xs font-semibold",
              index <= stepProgress
                ? "bg-primary"
                : "bg-white outline outline-1 outline-[#e2e8ea]",
              index == failStep - 1 ? "bg-red-500" : ""
            )}
          >
            {index < stepProgress && <Check color="white" size={14} />}
            {stepProgress === index && (
              <>
                {index == failStep - 1 ? (
                  <X color="white" size={14} />
                ) : (
                  <RefreshCw color="white" size={16} className="animate-spin" />
                )}
              </>
            )}
            {index > stepProgress && (
              <div className="text-[#e2e8ea]">{step}</div>
            )}
          </div>
          {index < Steps.length - 1 && (
            <div className="flex justify-center flex-1 py-2">
              <Separator
                orientation="vertical"
                className={`w-[1px] h-full ${
                  index < stepProgress ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
