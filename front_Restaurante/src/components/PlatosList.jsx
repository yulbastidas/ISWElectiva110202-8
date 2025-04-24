import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddPlato from "./AddPlato";
import EditPlato from "./EditPlato";

const ListaPlatos = () => {
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarAgregarPlato, setMostrarAgregarPlato] = useState(false);
  const [mostrarEditarPlato, setMostrarEditarPlato] = useState(false);
  const [platoSeleccionado, setPlatoSeleccionado] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Populares");

  const navigate = useNavigate();

  useEffect(() => {
    const nombreUsuario = localStorage.getItem("usuario");
    if (nombreUsuario) setUsuarioAutenticado(nombreUsuario);

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
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuarioAutenticado(null);
    navigate("/login");
  };

  const manejarAgregarPlato = (nuevoPlato) => {
    setPlatos((prev) => [...prev, nuevoPlato]);
  };

  const manejarEditarPlato = (plato) => {
    setPlatos((prev) =>
      prev.map((p) => (p.nombre === plato.nombre ? plato : p))
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
    <div className="bg-white min-h-screen">
      {/* Header de usuario */}
      {usuarioAutenticado && (
        <div className="bg-gray-100 p-4 text-right flex justify-end items-center gap-4">
          <span className="text-gray-700 font-semibold">
            Bienvenido, {usuarioAutenticado}
          </span>
          <button
            onClick={cerrarSesion}
            className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      )}
        <div className="rounded-md overflow-hidden shadow-md w-screen flex">
  {/* Contenedor Solo para el Logo (Izquierda) */}
  <div className="bg-red-600 py-10 px-6 flex items-center justify-start">
    <img
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNcxOl4P9C2ufcQLIqq_6N4MsZ0YlIi9B_vr3qpza08XK2jcnp92I_0pUz&s"
      alt="Logo La Casita del Cuy"
      className="w-32 h-32 rounded-full border-4 border-white"
    />
  </div>
  {/* Contenedor Blanco (Derecha) con Eslogan y Botón Café */}
  <div className="bg-white py-10 px-8 flex flex-col justify-center items-center flex-grow">
    <h1 className="text-xl font-bold text-red-600 text-center leading-tight mb-4">
      "UN MUNDO LLENO <br /> DE SABOR"
    </h1>
    <div
      className="bg-amber-900 text-white font-bold py-3 px-8 rounded-full shadow-md text-center"
    >
      EXPLORAR MENÚ
    </div>
  </div>
</div>
        
      {/* Filtro de menú */}
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold text-black mb-4 sm:mb-0">Explorar Menú</h2>
        <div className="flex items-center gap-4">
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option>Populares</option>
            <option>Entradas</option>
            <option>Platos Principales</option>
            <option>Postres</option>
            <option>Bebidas</option>
          </select>
          <button className="text-2xl">
            🛒
          </button>
        </div>
      </div>

      {/* Lista de platos */}
      <div className="max-w-6xl mx-auto p-5 bg-white shadow-md rounded-lg">
        <div className="flex justify-center mb-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {platos.map((plato) => (
              <div
                key={plato.id}
                className="bg-white border rounded-lg shadow hover:shadow-lg transition flex flex-col items-center p-4"
              >
                <div className="w-full h-40 bg-gray-100 mb-3 flex items-center justify-center rounded">
                  <span className="text-gray-400">[Imagen]</span>
                </div>
                <h3 className="text-lg font-bold">{plato.nombre}</h3>
                <p className="text-gray-500 text-sm">{plato.descripcion}</p>
                <p className="text-black font-semibold text-lg mt-2">
                  ${plato.precio}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => manejarEditarClick(plato)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => manejarEliminarPlato(plato.nombre)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() =>
                      alert(`Plato ${plato.nombre} añadido al carrito`)
                    }
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Añadir al carrito
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
    </div>
  );
};

export default ListaPlatos;
