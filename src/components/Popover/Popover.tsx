import { cn } from "@/utils/cn";
import * as Popover from "@radix-ui/react-popover";

interface PopoverOption {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
}

interface PopoverMenuProps {
  triggerContent: React.ReactNode;
  options: PopoverOption[];
  className?: string;
  offset?: number;
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  triggerContent,
  options,
  className,
  offset = 15,
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger>{triggerContent}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="p-2 bg-gray border-card relative overflow-hidden rounded-xl !z-50"
          sideOffset={offset}
        >
          {options.map(option => (
            <button
              key={option.key}
              onClick={option.onClick}
              className={cn(
                "text-white w-full flex gap-4 p-2 hover:opacity-80 items-center",
                className
              )}
            >
              {option.icon} {option.label}
            </button>
          ))}
          <Popover.Arrow className="PopoverArrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
