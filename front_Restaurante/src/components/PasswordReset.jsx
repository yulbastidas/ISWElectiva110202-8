import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    
    if (email === "") {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    
    setMessage("Código de recuperación enviado a tu correo.");

    
    setTimeout(() => {
      navigate("/password-verify"); 
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-gray-300 rounded-md shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">Recuperar contraseña</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm text-black mb-1">Correo electrónico</label>
            <input
              type="email"
              className="w-full border border-gray-400 p-2 rounded"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Enviar código de recuperación
          </button>
        </form>
      </div>
    </div>
  );
}