import "./LoginForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/session";
import { Redirect, useHistory } from "react-router-dom";

export default function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      credential,
      password,
    };
    try {
      const res = await dispatch(login(payload));
      history.push("/");
      return res;
    } catch (err) {
      const error = await err.json();
      if (!error.errors) {
        setErrors({ message: error.message });
      } else {
        setErrors(error.errors);
      }
    }
  };

  return (
    <div className="form">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            id="credential"
            name="credential"
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        {errors && errors.credential && (
          <p className="errors">{errors.credential}</p>
        )}
        <div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errors && errors.password && (
          <p className="errors">{errors.password}</p>
        )}
        {errors && errors.message && <p className="errors">{errors.message}</p>}
        <button>Login</button>
      </form>
    </div>
  );
}
