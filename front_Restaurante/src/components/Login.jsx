import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Verificar que los campos no estén vacíos antes de hacer la petición
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

      // Guardar token y nombre de usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      alert("¡Inicio de sesión exitoso!");
      navigate("/platos"); // Redirigir al usuario después de iniciar sesión
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-gray-300 rounded-md overflow-hidden shadow-md">
        <div className="bg-[#643200] h-16"></div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-black mb-1 uppercase">
            Iniciar Sesión
          </h1>
          <p className="text-center text-black text-sm mb-6">
            ¿Es tu primera vez?{" "}
            <Link
              to="/register"
              className="text-black font-semibold underline hover:text-red-600"
            >
              Registrarse
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-black text-sm mb-1">Usuario</label>
              <input
                type="text"
                placeholder="usuario"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-black text-sm mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="contraseña"
                className="w-full border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="text-sm text-center mb-2">
              <Link
                to="/password-reset"
                className="font-semibold underline text-black hover:text-red-600"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
