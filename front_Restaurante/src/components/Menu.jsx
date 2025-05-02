import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ListaPlatos = ({ onAgregarAlCarrito, carrito }) => { // Recibe la prop 'carrito'
  const [platos, setPlatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Populares");

  const navigate = useNavigate();

  useEffect(() => {
    const nombreUsuario = localStorage.getItem("usuario");
    if (nombreUsuario) setUsuarioAutenticado(nombreUsuario);

    const cargarPlatos = async () => {
      setCargando(true);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/restaurante/");
        setPlatos(response.data.platos);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener los platos:", error);
        setError("No se pudieron cargar los platos.");
        setCargando(false);
      }
    };

    cargarPlatos(); // Cargar los platos al montar el componente

    // Establecer un intervalo para recargar los platos cada 5 segundos (ajusta el valor según necesites)
    const intervalo = setInterval(cargarPlatos, 5000);

    // Limpiar el intervalo cuando el componente se desmonte para evitar fugas de memoria
    return () => clearInterval(intervalo);
  }, []); // El array de dependencias vacío asegura que esto se ejecute solo al montar y desmontar

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

  const carritoCantidad = carrito ? carrito.reduce((acc, item) => acc + item.cantidad, 0) : 0;

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
          <Link
            to="/carrito"
            className="bg-amber-900 text-white font-bold py-3 px-8 rounded-full shadow-md text-center hover:bg-amber-700 transition duration-300"
          >
            VER CARRITO
          </Link>
        </div>
      </div>

      {/* Filtro de menú */}
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row justify-between items-center">
        <h2 className="text-2xl font-bold text-black mb-4 sm:mb-0">Explorar Menú</h2>
        <div className="flex items-center gap-4 relative"> {/* Añade 'relative' al div contenedor */}
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-red-500 focus:border-red-500"
          >
            <option>Populares</option>
            <option>Entradas</option>
            <option>Platos Principales</option>
            <option>Postres</option>
            <option>Bebidas</option>
          </select>
          <Link to="/carrito" className="text-2xl text-red-600 hover:text-red-700 transition duration-300 relative"> {/* Añade 'relative' al Link */}
            🛒
            {carritoCantidad > 0 && (
              <span className="absolute top-[-8px] right-[-8px] bg-white text-red-600 rounded-full text-xs font-semibold px-2 py-0.5">
                {carritoCantidad}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Lista de platos */}
      <div className="max-w-6xl mx-auto p-5 bg-white shadow-md rounded-lg">
        {platos.length === 0 ? (
          <p className="text-center text-gray-500">No hay platos disponibles.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {platos.map((plato) => (
              <div
                key={plato.id}
                className="bg-white border rounded-lg shadow hover:shadow-lg transition flex flex-col items-center p-4"
              >
                <div className="w-full h-48 bg-gray-100 mb-3 flex items-center justify-center rounded overflow-hidden">
                  {plato.imagen ? (
                    <img
                      src={plato.imagen}
                      alt={plato.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Error loading image:", plato.imagen);
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=Sin+Imagen";
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">Sin Imagen</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-center text-gray-800">{plato.nombre}</h3>
                <p className="text-gray-500 text-sm text-center line-clamp-2">{plato.descripcion}</p>
                <p className="text-red-600 font-bold text-lg mt-2 text-center">
                  ${plato.precio}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <button
                    onClick={() => onAgregarAlCarrito(plato)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaPlatos;