import React, { useState } from "react"; // Importa useState
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import PlatosList from "./components/PlatosList.jsx";
import Navbar from "./components/Navbar.jsx";
import PasswordReset from "./components/PasswordReset.jsx";
import PasswordVerify from "./components/PasswordVerify.jsx";
import Menu from "./components/Menu.jsx"; // Importa el componente que crearás para el menú de usuario
import CarritoCompras from "./components/CarritoCompras.jsx"; // Importa el componente CarritoCompras
import PedidoConfirmado from "./components/PedidoConfirmado.jsx"; // Importa el componente PedidoConfirmado

function App() {
  const [carrito, setCarrito] = useState([]); // Estado para el carrito

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

  return (
    <Router>
      <Navbar carritoCantidad={carritoCantidad} /> {/* Pasa la cantidad al Navbar */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/platos" element={<PlatosList />} /> {/* Esto podría ser para la gestión admin */}
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/password-verify" element={<PasswordVerify />} />
          <Route path="/menu" element={<Menu onAgregarAlCarrito={agregarAlCarrito} carrito={carrito} />} /> {/* Pasa la función y el carrito al Menu */}
          <Route path="/carrito" element={<CarritoCompras
            carrito={carrito}
            onActualizarCantidad={actualizarCantidad}
            onEliminarDelCarrito={eliminarDelCarrito}
            onVaciarCarrito={vaciarCarrito} // Pasa la función para vaciar el carrito
          />} /> {/* Ruta para el carrito */}
          <Route path="/pedido-confirmado" element={<PedidoConfirmado />} /> {/* Ruta para la confirmación del pedido */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;