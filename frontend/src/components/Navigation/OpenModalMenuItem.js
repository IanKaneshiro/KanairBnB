import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
}) {
  const { setModalContent, setOpenModal } = useModal();

  const onClick = () => {
    setOpenModal(true);
    setModalContent(modalComponent);
    onItemClick();
  };

  return <li onClick={onClick}>{itemText}</li>;
}

export default OpenModalMenuItem;
