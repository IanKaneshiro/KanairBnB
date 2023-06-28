import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewSpot } from "../../store/spots";
import { Redirect } from "react-router-dom";
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
  const [errors, setErrors] = useState({});

  const session = useSelector((state) => state.session.user);

  if (!session) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
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
    console.log(payload);

    return dispatch(addNewSpot(payload)).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
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
              {errors.country && <p>{errors.country}</p>}
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
              {errors.address && <p>{errors.address}</p>}
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
              {errors.city && <p>{errors.city}</p>}
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
              {errors.state && <p>{errors.state}</p>}
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
              {errors.lat && <p>{errors.lat}</p>}
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
              {errors.lng && <p>{errors.lng}</p>}
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
            placeholder="Desciption"
            style={{ width: "100%", height: "100px" }}
          ></textarea>
          {errors.description && <p>{errors.description}</p>}
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
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div className="spot-form-price">
          <h2>Set a base price for your spot</h2>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <span>$</span>
          <input
            type="number"
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && <p>{errors.price}</p>}
        </div>
        <div className="spot-form-photos">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            type="text"
            placeholder="Preview Image URL"
            onChange={(e) => setPreviewImage(e.target.value)}
          />
          {errors.previewImage && <p>{errors.previewImage}</p>}
          <input type="text" placeholder="Image URL" />
          <p>Image URL must end in .png, .jpg, or .jpeg</p>
          <input type="text" placeholder="Image URL" />
          <input type="text" placeholder="Image URL" />
          <input type="text" placeholder="Image URL" />
        </div>
        <button>Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
