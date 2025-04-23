import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#5E2A00] text-white px-8 py-4 flex justify-between items-center">
      <div className="flex space-x-8 text-sm font-bold">
        <Link to="/ordenar" className="hover:underline">PIDE EN LÍNEA</Link>
        <Link to="/inicio" className="hover:underline">INICIO</Link>
        <Link to="/promos" className="hover:underline">PROMOS</Link>
        <Link to="/platos" className="hover:underline">PLATOS</Link>
        <Link to="/seguimiento" className="hover:underline">SIGUE TU PEDIDO</Link>
        <Link to="/nosotros" className="hover:underline">SOBRE NOSOTROS</Link>
      </div>

      <div className="flex items-center space-x-4 text-sm font-bold">
        <Link to="/register" className="hover:underline">Crear Cuenta</Link>
        <Link to="/" className="hover:underline">Iniciar Sesión</Link>
      </div>
    </nav>
  );
}
