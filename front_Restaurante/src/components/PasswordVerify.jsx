import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordVerify() {
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleVerificacion = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    
    if (codigo !== "123456") {
      setError("Código incorrecto. Intenta con '123456'.");
      return;
    }

    if (nuevaContrasena !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSuccess("¡Contraseña actualizada exitosamente!");

    
    setTimeout(() => {
      navigate("/"); 
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-gray-300 rounded-md shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-black">
          Verifica tu código
        </h1>
        <form onSubmit={handleVerificacion} className="space-y-4">
          <div>
            <label className="block text-sm text-black mb-1">Código recibido</label>
            <input
              type="text"
              className="w-full border border-gray-400 p-2 rounded"
              placeholder="Ej: 123456"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Nueva contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-400 p-2 rounded"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-black mb-1">Confirmar contraseña</label>
            <input
              type="password"
              className="w-full border border-gray-400 p-2 rounded"
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}