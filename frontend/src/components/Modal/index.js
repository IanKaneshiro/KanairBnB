import { createPortal } from "react-dom";
import { useModal } from "../../context/Modal";

const Modal = () => {
  const { modalContent, openModal } = useModal();
  if (!openModal) return null;
  return createPortal(modalContent, document.getElementById("portal"));
};

export default Modal;
