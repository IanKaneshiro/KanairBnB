import "./LoginForm.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/session";
import { useModal } from "../../context/Modal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef();
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
    setErrors({});
    return dispatch(login({ credential, password })).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form" ref={formRef}>
        <i class="fa-solid fa-xmark" onClick={() => setOpenModal(false)}></i>
        <h1>Login</h1>
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
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errors && errors.password && (
          <p className="errors">{errors.password}</p>
        )}
        {errors && errors.login && <p className="errors">{errors.login}</p>}
        <button>Login</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
