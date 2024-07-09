import React, {
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { useOutsideClick } from "../hooks/useOutsideClick";

type ModalContextType = {
  modalName: string;
  open: (name: string) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType>({
  modalName: "",
  open: () => {},
  close: () => {},
});

function Modal({ children }: { children: React.ReactNode }) {
  const [modalName, setModalName] = useState<string>("");

  const open = (name: string) => {
    setModalName(name);
  };
  const close = () => {
    setModalName("");
  };

  return (
    <ModalContext.Provider value={{ modalName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Button({
  name,
  children,
}: {
  name: string;
  children: React.ReactElement;
}) {
  const { modalName, open, close } = useContext(ModalContext);

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    modalName ? close() : open(name);
  };

  return React.cloneElement(children, {
    onClick: handleClick,
  });
}

function Window({
  name,
  children,
}: {
  name: string;
  children: React.ReactElement;
}) {
  const { modalName, close } = useContext(ModalContext);

  const modalRef = useOutsideClick(close);

  if (modalName !== name) {
    return null;
  }

  return createPortal(
    <div
      ref={modalRef}
      className="fixed left-0 top-28 h-screen w-screen bg-white"
    >
      <div
        className="absolute right-3 top-3 rounded-full bg-orange-100 px-2 text-lg"
        onClick={close}
      >
        X
      </div>
      {cloneElement(children, {
        onCloseModal: close,
      })}
    </div>,
    document.body,
  );
}

export function useModal() {
  const context = useContext<ModalContextType>(ModalContext);

  if (context === null) {
    throw new Error("Context referenced outside of the scope.");
  }

  return context;
}

Modal.Button = Button;
Modal.Window = Window;

export default Modal;
