import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar({ carritoCantidad, onLogoutSuccess }) {
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedIsAdmin = localStorage.getItem("isAdmin");

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedIsAdmin === "true") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isAdmin");
    setUsername(null);
    setIsAdmin(false);
    onLogoutSuccess(); // Llama a la función para actualizar el estado en App.js
    navigate("/");
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <nav className="bg-[#5E2A00] text-white px-10 py-5 flex justify-between items-center relative">
      <div className="flex space-x-15 text-sm font-bold uppercase">
        <Link to="/ordenar" className="hover:underline">Pide en línea</Link>
        <Link to="/inicio" className="hover:underline">Inicio</Link>
        <Link to="/promos" className="hover:underline">Promos</Link>
        <Link to={isAdmin ? "/platos" : "/menu"} className="hover:underline">
          {isAdmin ? "Platos" : "Menú"}
        </Link>
        <Link to="/seguimiento" className="hover:underline">Sigue tu pedido</Link>
        <Link to="/nosotros" className="hover:underline">Sobre nosotros</Link>
      </div>

      <div className="flex items-center space-x-2 text-sm font-bold uppercase relative">
        <Link to="/carrito" className="hover:underline mr-4">
          Carrito ({carritoCantidad})
        </Link>
        {username ? (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center bg-black text-white px-4 py-2 rounded-sm hover:opacity-90 transition"
            >
              Hola, {username}
              <FaChevronDown className="ml-2" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/"
              className="bg-black text-white px-5 py-3 rounded-sm hover:opacity-90 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-[#E4002B] text-white px-5 py-3 rounded-sm hover:opacity-90 transition"
            >
              Crear Cuenta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}