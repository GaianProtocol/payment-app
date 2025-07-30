import React from "react";
import { create } from "zustand";

export interface IModal {
  open: boolean;
  data: React.ReactNode | null;
  width?: number;
  title?: string | React.ReactNode;
  onClose?: () => void;
  autoClose?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  className?: string;
}

interface ModalState {
  modal: IModal;
  toggleModal: (payload: IModal) => void;
  closeModal: () => void;
}

const initialState: IModal = {
  open: false,
  data: null,
  width: 678, // 678
  title: undefined,
  autoClose: false,
  className: "",
};

const modalStore = create<ModalState>((set) => ({
  modal: initialState,
  toggleModal: (payload: IModal) =>
    set({
      modal: { ...payload },
    }),
  closeModal: () =>
    set({
      modal: { ...initialState },
    }),
}));
export default modalStore;
