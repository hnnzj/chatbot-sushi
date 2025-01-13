import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hook/useForm";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { errors, email, password, handleChange } = useForm({
    email: "",
    password: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/login`,
        { email: email, password: password },
        { withCredentials: true }
      );
      if (response.status == 200) navigate("/");
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <div className="formContainer">
      <div className="loginForm">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <div className={`input-container`}>
            <input placeholder="Correo" onChange={handleChange} name="email" />
            <span className="error-message">{errors.email}</span>
          </div>
          <div className={` input-container`}>
            <input
              placeholder="Ingresa tu contraseña"
              type="password"
              onChange={handleChange}
              name="password"
            />
            <span className="error-message">{errors.password}</span>
          </div>
          <button
            className={`login-btn ${
              Object.keys(errors).length > 0 ||
              email.length == 0 ||
              password.length == 0
                ? "btn-disabled"
                : ""
            }`}
          >
            Ingresar
          </button>
        </form>
        <p className="error-message">{error !== null ? error : ""}</p>
        <p>
          ¿No tenes cuenta? <Link to={"/register"}>Registrate</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
