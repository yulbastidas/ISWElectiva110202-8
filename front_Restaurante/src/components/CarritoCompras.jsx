// CarritoCompras.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CarritoCompras = ({ carrito, onActualizarCantidad, onEliminarDelCarrito }) => {
  const totalCarrito = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <ul>
          {carrito.map(item => (
            <li key={item.id} className="py-3 border-b flex items-center justify-between">
              <div className="flex items-center">
                {item.imagen && (
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50?text=Sin+Imagen";
                    }}
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.nombre}</h3>
                  <p className="text-gray-500 text-sm">Precio: ${item.precio}</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => onActualizarCantidad(item.id, item.cantidad - 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-l"
                >
                  -
                </button>
                <span className="mx-2">{item.cantidad}</span>
                <button
                  onClick={() => onActualizarCantidad(item.id, item.cantidad + 1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded-r"
                >
                  +
                </button>
                <button
                  onClick={() => onEliminarDelCarrito(item.id)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 py-3 border-t flex justify-between items-center">
        <span className="font-semibold">Total:</span>
        <span className="text-xl font-bold text-red-600">${totalCarrito.toFixed(2)}</span>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link to="/menu" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
          Seguir Comprando
        </Link>
        {carrito.length > 0 && (
          <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">
            Realizar Pedido
          </button>
        )}
      </div>
    </div>
  );
};

export default CarritoCompras;