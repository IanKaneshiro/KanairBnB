import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSpot } from "../../store/spots";
import { Redirect, useHistory, useParams } from "react-router-dom";

import "./UpdateSpotForm.css";

//TODO: fix loading of state, laggin images

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const session = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.userSpots[spotId]);

  const [country, setCountry] = useState(spot?.country);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [lat, setLat] = useState(spot?.lat);
  const [lng, setLng] = useState(spot?.lng);
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  const [price, setPrice] = useState(spot?.price);
  const [previewImage, setPreviewImage] = useState(spot?.previewImage);
  const [errors, setErrors] = useState({});

  if (!session) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      id: parseInt(spotId),
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
      previewImage,
    };

    try {
      const res = await dispatch(updateSpot(payload));
      if (res.id) {
        return history.push(`/spots/${res.id}`);
      }
    } catch (error) {
      const data = await error.json();
      if (data && data.errors) {
        if (!previewImage) {
          data.errors.previewImage = "Preview image is required";
        }
        if (
          previewImage &&
          !previewImage.endsWith(".png") &&
          !previewImage.endsWith(".jpg") &&
          !previewImage.endsWith(".jpeg")
        ) {
          data.errors.previewImage =
            "Image URL must end in .png, .jpg, or .jpeg";
        }
        if (!data.errors.description && description.length < 30)
          data.errors.description =
            "Description needs a minimum of 30 characters";
        setErrors(data.errors);
      }
    }
  };

  return (
    <div className="spot-form-container">
      <form onSubmit={handleSubmit} className="spot-form">
        <h1>Update your Spot</h1>
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
              value={country}
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
              value={address}
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
              value={city}
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
              value={state}
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
              value={lat}
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
              value={lng}
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
            value={description}
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
            placeholder="Name"
            value={name}
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
              value={price}
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
            value={previewImage}
            placeholder="Preview Image URL"
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {errors.previewImage && (
            <p className="error">{errors.previewImage}</p>
          )}
          <input type="text" placeholder="Image URL" />
          {/* <p>Image URL must end in .png, .jpg, or .jpeg</p> */}
          <input type="text" placeholder="Image URL" />
          <input type="text" placeholder="Image URL" />
          <input type="text" placeholder="Image URL" />
        </div>
        <button>Update Spot</button>
      </form>
    </div>
  );
}

export default UpdateSpotForm;
