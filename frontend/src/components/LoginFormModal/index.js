// frontend/src/components/LoginFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { Redirect } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const session = useSelector((state) => state.session.user);

  if (session) return <Redirect to="/" />;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const disableButton = () => {
    if (password.length < 6) return true;
    if (credential.length < 4) return true;
    return false;
  };

  const logInDemo = () => {
    return dispatch(
      sessionActions.login({ credential: "demo", password: "password" })
    ).then(closeModal);
  };

  return (
    <div className="login-container">
      <h1>Log In</h1>
      {errors.login && <p className="errors">{errors.login}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder="Username or Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={disableButton()}>
          Log In
        </button>
      </form>
      <button className="demo-user-button" onClick={logInDemo}>
        Log in as Demo User
      </button>
    </div>
  );
}

export default LoginFormModal;
