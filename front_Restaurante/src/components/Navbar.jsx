import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-[#5E2A00] text-white px-8 py-7 flex justify-between items-center font-bold uppercase text-sm shadow-md">
      <div className="flex flex-wrap space-x-18">
        <Link to="/ordenar" className="hover:underline">Pide en línea</Link>
        <Link to="/inicio" className="hover:underline">Inicio</Link>
        <Link to="/promos" className="hover:underline">Promos</Link>
        <Link to="/seguimiento" className="hover:underline">Sigue tu pedido</Link>
      </div>

      <div className="flex space-x-2">
        <Link
          to="/login"
          className="bg-black text-white px-5 py-3 rounded-sm hover:opacity-90 transition duration-200"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="bg-[#E4002B] text-white px-5 py-3 rounded-sm hover:opacity-90 transition duration-200"
        >
          Crear cuenta
        </Link>
      </div>
    </nav>
  );
}
