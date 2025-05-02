import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AddPlato from "./AddPlato.jsx";
import EditPlato from "./EditPlato.jsx";

const AdminPlatos = () => {
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarAgregarPlato, setMostrarAgregarPlato] = useState(false);
  const [mostrarEditarPlato, setMostrarEditarPlato] = useState(false);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const nombreUsuario = localStorage.getItem("username"); // Usar 'username' como clave
    if (nombreUsuario) setUsuarioAutenticado(nombreUsuario);
    else navigate("/login"); // Redirigir si no hay usuario autenticado

    axios
      .get("http://127.0.0.1:8000/api/restaurante/")
      .then((response) => {
        setPlatos(response.data.platos);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener los platos:", error);
        setError("No se pudieron cargar los platos.");
        setCargando(false);
      });
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("token"); // Eliminar token
    localStorage.removeItem("username"); // Eliminar nombre de usuario
    setUsuarioAutenticado(null);
    navigate("/login");
  };

  const manejarAgregarPlato = (nuevoPlato) => {
    setPlatos((prev) => [...prev, nuevoPlato]);
    setMostrarAgregarPlato(false); // Cerrar el formulario después de agregar
  };

  const manejarEditarPlato = (platoActualizado) => {
    setPlatos((prev) =>
      prev.map((p) => (p.nombre === platoActualizado.nombre ? platoActualizado : p))
    );
    setMostrarEditarPlato(false);
    setPlatoSeleccionado(null);
  };

  const manejarEliminarPlato = (nombre) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este plato?")) return;

    axios
      .delete(`http://127.0.0.1:8000/api/restaurante/${encodeURIComponent(nombre)}/`)
      .then(() => {
        setPlatos((prev) => prev.filter((plato) => plato.nombre !== nombre));
      })
      .catch((error) => {
        console.error("Error al eliminar el plato:", error);
        setError("No se pudo eliminar el plato.");
      });
  };

  const manejarEditarClick = (plato) => {
    setPlatoSeleccionado(plato);
    setMostrarEditarPlato(true);
  };

  if (cargando) return <p className="text-center text-gray-500">Cargando platos...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header de administrador */}
      {usuarioAutenticado && (
        <div className="bg-gray-100 p-4 text-right flex justify-end items-center gap-4 mb-6">
          <span className="text-gray-700 font-semibold">
            Administrador: {usuarioAutenticado}
          </span>
          <button
            onClick={cerrarSesion}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Administración de Platos</h2>
        <button
          onClick={() => setMostrarAgregarPlato(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Agregar Plato
        </button>
      </div>

      {platos.length === 0 ? (
        <p className="text-center text-gray-500">No hay platos disponibles.</p>
      ) : (
        <div className="flex flex-wrap gap-8">
          {platos.map((plato) => (
            <div
              key={plato.id}
              className="bg-white border rounded-lg shadow hover:shadow-lg transition flex flex-col items-center p-4 w-72"
            >
              <div className="w-full h-48 bg-gray-100 mb-3 flex items-center justify-center rounded">
                {plato.imagen ? (
                  <img
                    src={plato.imagen}
                    alt={plato.nombre}
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <span className="text-gray-400">[Imagen]</span>
                )}
              </div>
              <h3 className="text-lg font-bold text-center">{plato.nombre}</h3>
              <p className="text-gray-500 text-sm text-center">{plato.descripcion}</p>
              <p className="text-black font-semibold text-lg mt-2 text-center">
                ${plato.precio}
              </p>
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => manejarEditarClick(plato)}
                  className="px-3 py-1 bg-amber-700 text-white rounded hover:bg-amber-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => manejarEliminarPlato(plato.nombre)}
                  className="px-3 py-1 bg-white text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarAgregarPlato && (
        <AddPlato
          onClose={() => setMostrarAgregarPlato(false)}
          onAddPlato={manejarAgregarPlato}
        />
      )}
      {mostrarEditarPlato && platoSeleccionado && (
        <EditPlato
          plato={platoSeleccionado}
          onClose={() => setMostrarEditarPlato(false)}
          onUpdatePlato={manejarEditarPlato}
        />
      )}
    </div>
  );
};

export default AdminPlatos;