import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import { Redirect } from "react-router-dom";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const session = useSelector((state) => state.session.user);

  useEffect(() => {
    const errors = {};
    if (username.length && username.length < 4) {
      errors.username = "* Username must be at least 4 characters";
    }

    if (password.length && password.length < 4) {
      errors.password = "* Password must be at least 6 characters";
    }

    if (
      password.length &&
      confirmPassword.length &&
      password !== confirmPassword
    ) {
      errors.confirmPassword = "* Password must match";
    }
    setErrors(errors);

    if (email.length && !email.includes("@")) {
      errors.email = "* Must be a valid email";
    }
  }, [username, password, confirmPassword, email]);

  if (session) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  const disableSignUpButton = () => {
    if (
      !email.length ||
      !username.length ||
      !firstName.length ||
      !lastName.length ||
      !password.length ||
      !confirmPassword.length
    )
      return true;

    if (username.length < 4) return true;

    if (password.length < 6) return true;
    return false;
  };

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />

        {errors.firstName && <p className="errors">{errors.firstName}</p>}

        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />

        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        {errors.email && <p className="errors">{errors.email}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />

        {errors.username && <p className="errors">{errors.username}</p>}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {errors.password && <p className="errors">{errors.password}</p>}

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />

        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        <button type="submit" disabled={disableSignUpButton()}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
