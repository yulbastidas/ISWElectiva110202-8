import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  const [username, setUsername] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername); 
    }
  }, []);

  const handleLogout = () => {
    
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null); 
    navigate("/"); // Redirigir a la página principal
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <nav className="bg-[#5E2A00] text-white px-10 py-5 flex justify-between items-center relative">
      <div className="flex space-x-15 text-sm font-bold uppercase">
        <Link to="/ordenar" className="hover:underline">Pide en línea</Link>
        <Link to="/inicio" className="hover:underline">Inicio</Link>
        <Link to="/promos" className="hover:underline">Promos</Link>
        <Link to="/platos" className="hover:underline">Platos</Link>
        <Link to="/seguimiento" className="hover:underline">Sigue tu pedido</Link>
        <Link to="/nosotros" className="hover:underline">Sobre nosotros</Link>
      </div>

      <div className="flex items-center space-x-2 text-sm font-bold uppercase relative">
        {username ? (
          
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center bg-black text-white px-4 py-2 rounded-sm hover:opacity-90 transition"
            >
              Hola, {username} {/* Saludo con el nombre del usuario */}
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
