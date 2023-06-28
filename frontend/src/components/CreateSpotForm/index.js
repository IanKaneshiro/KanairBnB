import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./CreateSpotForm.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(null);

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    const payload = {
      country,
      streetAddress,
      city,
      state,
      latitude,
      longitude,
      description,
      name,
      price,
    };

    console.log(payload);
    window.alert("submitted form");
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
            <label htmlFor="country">Country</label> <p>Country is required</p>
            <input
              type="text"
              id="country"
              placeholder="Country"
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="spot-form-input-address">
            <label htmlFor="address">Street Address</label>
            <p>Address is required</p>
            <input
              type="text"
              id="address"
              placeholder="Street Address"
              onChange={(e) => setStreetAddress(e.target.value)}
            />
          </div>
          <div className="spot-form-input-city">
            <label htmlFor="city">City</label> <p>City is required</p>
            <input
              type="text"
              id="city"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="spot-form-input-state">
            <label htmlFor="state">State</label> <p>State is required</p>
            <input
              type="text"
              id="state"
              placeholder="State"
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="spot-form-input-latitude">
            <label htmlFor="latitude">Latitude</label>
            <p>Latitude is required</p>
            <input
              type="number"
              id="latitude"
              placeholder="Latitude"
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className="spot-form-input-longitude">
            <label htmlFor="longitude">Longitude</label>
            <p>Longitude is required</p>
            <input
              type="number"
              id="longitude"
              placeholder="Longitude"
              onChange={(e) => setLongitude(e.target.value)}
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
          <p>Description needs a minimum of 30 characters</p>
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
          <p>Name is required</p>
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
          <p>Price is required</p>
        </div>
        <div className="spot-form-photos">
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input
            type="text"
            placeholder="Preview Image URL"
            onChange={(e) => setName(e.target.value)}
          />
          <p>preview image is required</p>
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setName(e.target.value)}
          />
          <p>Image URL must end in .png, .jpg, or .jpeg</p>
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Image URL"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button>Sign Up</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
