import React from "react";
import "./ImageGallery.css";
import { useSelector } from "react-redux";

const ImageGallery = () => {
  const previewImage = useSelector((state) => state.images.previewImage);
  const images = useSelector((state) => Object.values(state.images.images));

  const imagesArr = [previewImage, ...images];

  if (imagesArr.length < 2) {
    return (
      <div className="image-gallery-container-prev">
        <div className="preview-image">
          <img src={previewImage.url} alt={previewImage.id} />
        </div>
      </div>
    );
  }

  return (
    <div className="image-gallery-container">
      <div className="preview-image"></div>
      {imagesArr.map((img) => {
        return (
          <div key={img.id} className="image-gallery-item">
            <img src={img.url} alt={img.id} />
          </div>
        );
      })}
    </div>
  );
};

export default ImageGallery;
