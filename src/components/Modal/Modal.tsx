import { useCloseModal, useModal } from "@/hooks/useModal";
import { cn } from "@/utils/cn";
import * as Dialog from "@radix-ui/react-dialog";

export default function Modal() {
  const { open, onClose, title, data, width, className } = useModal();
  const closeModal = useCloseModal();

  const handleClose = () => {
    onClose && onClose();
    closeModal();
  };

  if (!data) return <></>;

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content
          style={{
            maxWidth: width || 450,
          }}
          className={cn(
            "DialogContent overflow-auto rounded-[20px] bg-[#202225] border-white border-opacity-15",
            className
          )}
          onInteractOutside={handleClose}
        >
          <Dialog.Title className="text-center text-white font-bold text-xl tracking-base">
            {title}
          </Dialog.Title>
          <Dialog.Description className="DialogDescription">
            {data}
          </Dialog.Description>
          {/* <Dialog.Close>
            <button className="IconButton" aria-label="Close">
              <IoCloseOutline stroke="#ffffffa6" />
            </button>
          </Dialog.Close> */}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
