import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#5E2A00] text-white px-8 py-3 flex justify-between items-center">
      <div className="flex space-x-15 text-sm font-bold uppercase">
        <Link to="/ordenar" className="hover:underline">Pide en línea</Link>
        <Link to="/inicio" className="hover:underline">Inicio</Link>
        <Link to="/promos" className="hover:underline">Promos</Link>
        <Link to="/platos" className="hover:underline">Platos</Link>
        <Link to="/seguimiento" className="hover:underline">Sigue tu pedido</Link>
        <Link to="/nosotros" className="hover:underline">Sobre nosotros</Link>
      </div>

      <div className="flex items-center space-x-2 text-sm font-bold uppercase">
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
      </div>
    </nav>
  );
}
