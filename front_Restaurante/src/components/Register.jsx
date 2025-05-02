import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

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

      alert("Registro exitoso. Redirigiendo al menú...");
      navigate("/menu"); // Redirige al menú después del registro
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
    <motion.div
      className="min-h-screen flex items-center justify-center bg-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-full max-w-md border border-gray-300 rounded-md overflow-hidden m-4 shadow-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      >
        <motion.div className="bg-[#643200] h-16"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
        <h2 className="text-2xl text-gray-700 font-bold text-center mt-4">
          Registro de Usuario
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
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

          <div className="flex items-center text-sm">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mr-2 w-4 h-4 accent-pink-600"
            />
            <label>
              Acepto los{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                términos y condiciones
              </Link>
            </label>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 text-lg rounded hover:bg-red-700 transition duration-200"
          >
            Registrarse
          </button>
          <p className="text-center text-gray-600 text-sm mt-2">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}