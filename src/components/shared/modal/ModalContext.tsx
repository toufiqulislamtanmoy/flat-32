"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface ModalOptions {
  title?: string;
  description?: string;
  content: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

interface ModalState extends Omit<ModalOptions, "content"> {
  isOpen: boolean;
  content: React.ReactNode;
}

interface ModalContextValue {
  modal: ModalState;
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const defaultState: ModalState = {
  isOpen: false,
  content: null,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  showCloseButton: true,
};

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>(defaultState);

  const openModal = useCallback((options: ModalOptions) => {
    setModal({
      isOpen: true,
      content: options.content,
      title: options.title,
      description: options.description,
      className: options.className,
      showCloseButton: options.showCloseButton ?? true,
      closeOnOverlayClick: options.closeOnOverlayClick ?? true,
      closeOnEscape: options.closeOnEscape ?? true,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const value = useMemo(() => ({ modal, openModal, closeModal }), [modal, openModal, closeModal]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
