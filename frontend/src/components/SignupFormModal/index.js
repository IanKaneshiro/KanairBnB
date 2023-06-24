import "./SignupForm.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../store/session";
import { useModal } from "../../context/Modal";

function SignupFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const formRef = useRef();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { setOpenModal, openModal } = useModal();

  useEffect(() => {
    if (!openModal) return;

    const closeModal = (e) => {
      if (!formRef.current?.contains(e.target)) {
        setOpenModal(false);
      }
    };
    document.addEventListener("click", closeModal);

    return () => document.removeEventListener("click", closeModal);
  }, [openModal, setOpenModal]);

  if (sessionUser) return setOpenModal(false);

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
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form" ref={formRef}>
        <i class="fa-solid fa-xmark" onClick={() => setOpenModal(false)}></i>
        <h1>Sign Up</h1>
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

export default SignupFormModal;
