import "./LoginForm.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/session";
import { Redirect } from "react-router-dom";

export default function LoginFormPage() {
  const dispatch = useDispatch();
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
      return res;
    } catch (err) {
      const error = await err.json();
      if (!error.errors) {
        setErrors({ message: error.message });
      } else {
        setErrors(error.errors);
      }
    }
    setPassword("");
    setCredential("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        {errors && errors.message && <p>{errors.message}</p>}
        <label htmlFor="credential">
          Credential:
          <input
            id="credential"
            name="credential"
            type="text"
            placeholder="Username or Email"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
        </label>
        {errors && errors.credential && <p>{errors.credential}</p>}
      </div>
      <div>
        <label htmlFor="password">
          Password:
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {errors && errors.password && <p>{errors.password}</p>}
      </div>
      <button>Login</button>
      <button>Sign Up</button>
    </form>
  );
}

// import React, { useState } from "react";
// import * as sessionActions from "../../store/session";
// import { useDispatch, useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";

// function LoginFormPage() {
//   const dispatch = useDispatch();
//   const sessionUser = useSelector((state) => state.session.user);
//   const [credential, setCredential] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState({});

//   if (sessionUser) return <Redirect to="/" />;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setErrors({});
//     return dispatch(sessionActions.login({ credential, password })).catch(
//       async (res) => {
//         const data = await res.json();
//         console.log(data);
//         if (data && data.errors) setErrors(data.errors);
//       }
//     );
//   };

//   return (
//     <>
//       <h1>Log In</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Username or Email
//           <input
//             type="text"
//             value={credential}
//             onChange={(e) => setCredential(e.target.value)}
//           />
//         </label>
//         {errors.credential && <p>{errors.credential}</p>}
//         <label>
//           Password
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           {errors.password && <p>{errors.password}</p>}
//         </label>
//         <button type="submit">Log In</button>
//       </form>
//     </>
//   );
// }

// export default LoginFormPage;
