import React from "react";
import { useModal } from "../../context/Modal";
import "./ModalGallery.css";

function OpenModalGallery({
  modalComponent, // component to render inside the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  src,
  alt,
  classItem,
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  return (
    <img
      style={{ cursor: "pointer" }}
      className={classItem}
      src={src}
      alt={alt}
      onClick={onClick}
    ></img>
  );
}

export default OpenModalGallery;
