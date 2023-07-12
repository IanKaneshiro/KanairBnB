import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewSpot } from "../../store/spots";
import { addImage } from "../../store/images";
import { Redirect, useHistory } from "react-router-dom";
import "./CreateSpotForm.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");

  const [errors, setErrors] = useState({});

  const session = useSelector((state) => state.session.user);

  const history = useHistory();

  if (!session) return <Redirect to="/" />;

  const handleDisabledBtn = () => {
    if (!country.length) return true;
    if (!address.length) return true;
    if (!city.length) return true;
    if (!state.length) return true;
    if (!lat) return true;
    if (!lng) return true;
    if (description.length < 30) return true;
    if (!name.length) return true;
    if (!price) return true;
    if (!previewImage.length) return true;
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const handleImages = () => {
      const errors = {};
      const imagePayload = [];
      if (!previewImage) {
        errors.previewImage = "Preview image is required";
      }
      if (
        previewImage &&
        !previewImage.endsWith(".png") &&
        !previewImage.endsWith(".jpg") &&
        !previewImage.endsWith(".jpeg")
      ) {
        errors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
      } else if (previewImage) {
        imagePayload.push({ url: previewImage, preview: true });
      }
      if (
        img1 &&
        !img1.endsWith(".png") &&
        !img1.endsWith(".jpg") &&
        !img1.endsWith(".jpeg")
      ) {
        errors.img1 = "Image URL must end in .png, .jpg, or .jpeg";
      } else if (img1) {
        imagePayload.push({ url: img1, preview: false });
      }
      if (
        img2 &&
        !img2.endsWith(".png") &&
        !img2.endsWith(".jpg") &&
        !img2.endsWith(".jpeg")
      ) {
        errors.img2 = "Image URL must end in .png, .jpg, or .jpeg";
      } else if (img2) {
        imagePayload.push({ url: img2, preview: false });
      }
      if (
        img3 &&
        !img3.endsWith(".png") &&
        !img3.endsWith(".jpg") &&
        !img3.endsWith(".jpeg")
      ) {
        errors.img3 = "Image URL must end in .png, .jpg, or .jpeg";
      } else if (img3) {
        imagePayload.push({ url: img3, preview: false });
      }
      if (
        img4 &&
        !img4.endsWith(".png") &&
        !img4.endsWith(".jpg") &&
        !img4.endsWith(".jpeg")
      ) {
        errors.img4 = "Image URL must end in .png, .jpg, or .jpeg";
      } else if (img4) {
        imagePayload.push({ url: img4, preview: false });
      }

      return { errors, imagePayload };
    };

    const spotPayload = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };

    try {
      const { imagePayload, errors } = handleImages();

      setErrors(errors);
      if (Object.values(errors).length) return setErrors(errors);

      const res = await dispatch(addNewSpot(spotPayload));
      if (res.id) {
        await dispatch(addImage(imagePayload, res.id));
        return history.push(`/spots/${res.id}`);
      }
    } catch (error) {
      try {
        const data = await error.json();
        if (data && data.errors) {
          if (!data.errors.description && description.length < 30)
            data.errors.description =
              "Description needs a minimum of 30 characters";
          setErrors(data.errors);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="spot-form-container">
      <form onSubmit={handleSubmit} className="spot-form">
        <h1>Create a New Spot</h1>
        <h2>Where's your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <div className="spot-form-location">
          <div className="spot-form-input-country">
            <div className="spot-form-error">
              <label htmlFor="country">Country</label>
              {errors.country && <p className="error">{errors.country}</p>}
            </div>
            <input
              type="text"
              id="country"
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="spot-form-input-address">
            <div className="spot-form-error">
              <label htmlFor="address">Street Address</label>
              {errors.address && <p className="error">{errors.address}</p>}
            </div>
            <input
              type="text"
              id="address"
              placeholder="Street Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="spot-form-input-city">
            <div className="spot-form-error">
              <label htmlFor="city">City</label>{" "}
              {errors.city && <p className="error">{errors.city}</p>}
            </div>
            <input
              type="text"
              id="city"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="spot-form-input-state">
            <div className="spot-form-error">
              <label htmlFor="state">State</label>{" "}
              {errors.state && <p className="error">{errors.state}</p>}
            </div>
            <input
              type="text"
              id="state"
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="spot-form-input-latitude">
            <div className="spot-form-error">
              <label htmlFor="latitude">Latitude</label>
              {errors.lat && <p className="error">{errors.lat}</p>}
            </div>
            <input
              type="number"
              id="latitude"
              placeholder="Latitude"
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div className="spot-form-input-longitude">
            <div className="spot-form-error">
              <label htmlFor="longitude">Longitude</label>
              {errors.lng && <p className="error">{errors.lng}</p>}
            </div>
            <input
              type="number"
              id="longitude"
              placeholder="Longitude"
              onChange={(e) => setLng(e.target.value)}
            />
          </div>
        </div>
        <div className="spot-form-description">
          <h2>Describe your place to guests</h2>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood
          </p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            style={{ height: "100px" }}
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div className="spot-form-title">
          <h2>Create a title for your spot</h2>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special
          </p>
          <input
            type="text"
            placeholder="Name of your spot"
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="spot-form-price">
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <div className="spot-form-price-input">
            <span>$</span>
            <input
              type="number"
              placeholder="Price per night (USD)"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div className="spot-form-photos">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            type="text"
            placeholder="Preview Image URL"
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {errors.previewImage && (
            <p className="error">{errors.previewImage}</p>
          )}
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setImg1(e.target.value)}
          />
          {errors.img1 && <p className="error">{errors.img1}</p>}
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setImg2(e.target.value)}
          />
          {errors.img2 && <p className="error">{errors.img2}</p>}
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setImg3(e.target.value)}
          />
          {errors.img3 && <p className="error">{errors.img3}</p>}
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setImg4(e.target.value)}
          />
          {errors.img4 && <p className="error">{errors.img4}</p>}
        </div>
        <button disabled={handleDisabledBtn()}>Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
