import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  return (
    <ModalContext.Provider
      value={{ openModal, setOpenModal, modalContent, setModalContent }}
    >
      {children}
    </ModalContext.Provider>
  );
};
