import "./SignupForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { signup } from "../../store/session";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        setErrors({});
        const res = await dispatch(
          signup({
            email,
            username,
            firstName,
            lastName,
            password,
          })
        );
        return res;
      } catch (err) {
        const data = await err.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      }
    } else {
      setErrors({
        confirmPassword: "Passwords must match",
      });
    }
  };

  return (
    <div className="form">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        {errors.email && <p className="errors">{errors.email}</p>}
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
        </div>
        {errors.username && <p className="errors">{errors.username}</p>}
        <div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            required
          />
        </div>
        {errors.firstName && <p className="errors">{errors.firstName}</p>}
        <div>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            required
          />
        </div>
        {errors.lastName && <p className="errors">{errors.lastName}</p>}
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {errors.password && <p className="errors">{errors.password}</p>}
        <div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        </div>
        {errors.confirmPassword && (
          <p className="errors">{errors.confirmPassword}</p>
        )}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
