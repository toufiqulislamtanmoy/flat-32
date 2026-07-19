"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "./ModalContext";

export default function GlobalModal() {
  const { modal, closeModal } = useModal();

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(open) => {
        if (!open) closeModal();
      }}
    >
      <DialogContent className={modal.className} showCloseButton={modal.showCloseButton}>
        {(modal.title || modal.description) && (
          <DialogHeader>
            {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
            {modal.description && <DialogDescription>{modal.description}</DialogDescription>}
          </DialogHeader>
        )}
        {modal.content}
      </DialogContent>
    </Dialog>
  );
}
