import modalStore from "@/store/modalStore";

export const useModal = () => modalStore((state) => state.modal);

export const useCloseModal = () => modalStore((state) => state.closeModal);

export const useToggleModal = () => modalStore((state) => state.toggleModal);
