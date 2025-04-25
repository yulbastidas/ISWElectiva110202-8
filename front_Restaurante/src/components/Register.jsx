import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    terms: false,
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    try {
      const { username, email, password } = formData;

      await axios.post("http://localhost:8000/api/usuarios/registro/", {
        username,
        email,
        password,
      });

      localStorage.setItem("username", username);

      alert("Registro exitoso. Redirigiendo...");
      navigate("/platos");
    } catch (err) {
      if (err.response && err.response.data) {
        console.error("Detalles del error:", err.response.data);
        setError("Error en el registro: " + JSON.stringify(err.response.data));
      } else {
        setError("Error inesperado. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-gray-300 rounded-md overflow-hidden m-4 shadow-lg animate-fade-in">
        <div className="bg-amber-900 h-12 rounded-t-md animate-slide-down"></div>
        <h2 className="text-2xl text-gray-700 font-bold text-center mt-4 animate-fade-in-up">
          Registro de Usuario
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 animate-fade-in-up delay-100">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300"
          />

          <div className="flex items-center text-sm animate-fade-in-up delay-150">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mr-2 w-4 h-4 accent-pink-600"
            />
            <label>
              Acepto los{" "}
              <a href="#" className="text-blue-600 hover:underline">
                términos y condiciones
              </a>
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 text-lg rounded hover:bg-red-700 transition duration-200 animate-fade-in-up delay-200"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
