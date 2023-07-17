import React from "react";
import "./ImageGallery.css";
import { useSelector } from "react-redux";

const ImageGallery = () => {
  const previewImage = useSelector((state) => state.images.previewImage);
  const images = useSelector((state) => Object.values(state.images.images));

  const imagesArr = [previewImage, ...images];

  return (
    <ul className="image-gallery-container">
      {imagesArr.map((img) => {
        return (
          <li key={img.id} className="image-gallery-item">
            <img src={img.url} alt={img.id} />
          </li>
        );
      })}
    </ul>
  );
};

export default ImageGallery;
