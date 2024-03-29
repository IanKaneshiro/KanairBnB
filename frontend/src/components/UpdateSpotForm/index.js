import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetUsersSpots, updateSpot } from "../../store/spots";
import { Redirect, useHistory, useParams } from "react-router-dom";

import "./UpdateSpotForm.css";

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { spotId } = useParams();
  const session = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spots.userSpots[spotId]);

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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (spot) {
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setLat(spot.lat);
      setLng(spot.lng);
      setDescription(spot.description);
      setName(spot.name);
      setPrice(spot.price);
      setPreviewImage(spot.previewImage);
    }
  }, [spot]);

  useEffect(() => {
    const errors = {};

    if (description.length && description.length < 30) {
      errors.description = "Description needs a minimum of 30 characters";
    }

    if ((lat && lat > 90) || lat < -90) {
      errors.lat = "Not a valid latitude";
    }

    if ((lng && lng > 190) || lng < -180) {
      errors.lng = "Not a valid longitude";
    }
    setErrors(errors);
  }, [previewImage, description, lat, lng]);

  useEffect(() => {
    dispatch(thunkGetUsersSpots());
  }, [dispatch]);

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
      description,
      name,
      price,
      previewImage,
    };

    if (lat) payload.lat = lat;
    if (lng) payload.lng = lng;

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
              <label htmlFor="state">State</label>
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
              {errors.lat && <span className="error">{errors.lat}</span>}
            </div>
            <input
              type="number"
              id="latitude"
              step="any"
              placeholder="Latitude (Optional)"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </div>
          <div className="spot-form-input-longitude">
            <div className="spot-form-error">
              <label htmlFor="longitude">Longitude</label>
              {errors.lng && <span className="error">{errors.lng}</span>}
            </div>
            <input
              type="number"
              id="longitude"
              step="any"
              placeholder="Longitude (Optional)"
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
