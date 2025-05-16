import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Por favor ingresa ambos campos.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/usuarios/login/", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("isAdmin", username === "admin" ? "true" : "false"); // Establece isAdmin

      alert("¡Inicio de sesión exitoso!");
      onLoginSuccess(); // Llama a la función para actualizar el estado en App.js

      if (username === "admin") {
        navigate("/platos");
      } else {
        navigate("/menu");
      }

    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-white flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="w-full max-w-md border border-gray-300 rounded-md overflow-hidden shadow-md"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      >
        <motion.div
          className="bg-[#643200] h-16"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>

        <motion.div className="p-8" initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
          <motion.h1
            className="text-3xl font-bold text-center text-black mb-1 uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Iniciar Sesión
          </motion.h1>

          <motion.p
            className="text-center text-black text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ¿Es tu primera vez?{" "}
            <Link
              to="/register"
              className="text-black font-semibold underline hover:text-red-600"
            >
              Registrarse
            </Link>
          </motion.p>

          <motion.form
            onSubmit={handleLogin}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <label className="block text-black text-sm mb-1">Usuario</label>
              <motion.input
                type="text"
                placeholder="usuario"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <div>
              <label className="block text-black text-sm mb-1">Contraseña</label>
              <motion.input
                type="password"
                placeholder="contraseña"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <motion.div
              className="text-sm text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="#"
                className="font-semibold underline text-black hover:text-red-600"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </motion.div>

            {error && (
              <motion.p
                className="text-red-600 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Iniciar Sesión
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}