// src/components/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    terms: false
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      const { username, email, password } = formData;
      await axios.post("http://localhost:8000/api/usuarios/registro/", {
        username, email, password
      });

      alert("Registro exitoso");
      navigate("/platos");
    } catch (err) {
      if (err.response && err.response.data) {
        console.error("Detalles del error:", err.response.data);
        alert("Error en el registro: " + JSON.stringify(err.response.data));
      } else {
        alert("Error inesperado. Intenta de nuevo.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border">
        <div className="bg-amber-900 h-12 mb-4 rounded-t-lg"></div>
        <h2 className="text-lg text-gray-700 mb-4">nombre de usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="nombre"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="email"
            name="email"
            placeholder="correo"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="password"
            name="password"
            placeholder="contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mr-2 w-4 h-4 accent-pink-600"
            />
            <label className="text-sm">
              <a href="#" className="text-blue-600 hover:underline">Aceptar términos y condiciones</a>
            </label>
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 text-lg rounded hover:bg-red-700 transition duration-200"
          >
            REGISTRARSE
          </button>
        </form>
      </div>
    </div>
  );
}
