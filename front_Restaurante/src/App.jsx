import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Se eliminó BrowserRouter de aquí
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import PlatosList from "./components/PlatosList.jsx";
import Navbar from "./components/Navbar.jsx";
import PasswordReset from "./components/PasswordReset.jsx";
import PasswordVerify from "./components/PasswordVerify.jsx";
import Menu from "./components/Menu.jsx";
import CarritoCompras from "./components/CarritoCompras.jsx";
import PedidoConfirmado from "./components/PedidoConfirmado.jsx";

function App() {
  const [carrito, setCarrito] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const agregarAlCarrito = (plato) => {
    const existe = carrito.find(item => item.id === plato.id);
    if (existe) {
      setCarrito(carrito.map(item =>
        item.id === plato.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setCarrito([...carrito, { ...plato, cantidad: 1 }]);
    }
  };

  const actualizarCantidad = (platoId, nuevaCantidad) => {
    setCarrito(carrito.map(item =>
      item.id === platoId ? { ...item, cantidad: Math.max(1, nuevaCantidad) } : item
    ));
  };

  const eliminarDelCarrito = (platoId) => {
    setCarrito(carrito.filter(item => item.id !== platoId));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const carritoCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogoutSuccess = () => {
    setIsAuthenticated(false);
  };

  return (
    <> {/* Se reemplazó Router con un Fragment o un div si es necesario */}
      {isAuthenticated && <Navbar carritoCantidad={carritoCantidad} onLogoutSuccess={handleLogoutSuccess} />}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/platos" element={<PlatosList />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/password-verify" element={<PasswordVerify />} />
          <Route path="/menu" element={<Menu onAgregarAlCarrito={agregarAlCarrito} carrito={carrito} />} />
          <Route path="/carrito" element={<CarritoCompras
            carrito={carrito}
            onActualizarCantidad={actualizarCantidad}
            onEliminarDelCarrito={eliminarDelCarrito}
            onVaciarCarrito={vaciarCarrito}
          />} />
          <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        </Routes>
      </div>
    </>
  );
}

export default App;