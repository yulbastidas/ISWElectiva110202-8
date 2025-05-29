import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarritoCompras = ({ carrito, onActualizarCantidad, onEliminarDelCarrito, onVaciarCarrito }) => {
  const [direccionEnvio, setDireccionEnvio] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const totalCarrito = carrito.reduce((acc, item) => acc + parseFloat(item.precio) * item.cantidad, 0);

  const realizarPedido = async () => {
    if (carrito.length === 0) {
      setMensaje('Tu carrito está vacío. Agrega productos para realizar un pedido.');
      return;
    }

    if (!direccionEnvio) {
      setMensaje('Por favor, ingresa la dirección de envío.');
      return;
    }

    if (!metodoPago) {
      setMensaje('Por favor, selecciona un método de pago.');
      return;
    }

    setMensaje('Realizando pedido...');

    const urlPedido = 'http://127.0.0.1:8000/api/restaurante/pedidos/';
    console.log('URL de la petición:', urlPedido);
    console.log('Datos del carrito justo antes del pedido:', carrito);

    try {
      const dataPedido = {
        items: carrito.map(item => ({
          plato_id: item.id,
          cantidad: item.cantidad,
        })),
        direccion_envio: direccionEnvio,
      };

      console.log('Datos completos para el pedido:', dataPedido);

      const response = await axios.post(urlPedido, dataPedido);

      if (response.status === 201) {
        setMensaje('Pedido realizado con éxito. ¡Gracias por tu compra!');
        const pedidoRealizado = response.data; // Asumiendo que la API devuelve información del pedido

        // Navegar a PedidoConfirmado y pasar los datos del carrito
        navigate('/pedido-confirmado', { state: { carrito: [...carrito], totalCarrito: totalCarrito } });
        onVaciarCarrito();
      } else {
        setMensaje('Hubo un error al realizar el pedido. Por favor, inténtalo de nuevo.');
        console.error('Error en la respuesta del pedido:', response);
      }
    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      if (error.response && error.response.data) {
        console.error('Detalles del error (respuesta completa):', error.response.data);

        const mensajeError = error.response.data.detalles
          ? JSON.stringify(error.response.data.detalles, null, 2)
          : error.response.data.error || 'Datos inválidos';

        setMensaje(`❌ Error del servidor:\n${mensajeError}`);
      } else {
        setMensaje('❌ Hubo un error de conexión. Por favor, inténtalo más tarde.');
      }
    }
  };

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

      {carrito.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Detalles del Pedido</h3>
          <div className="mb-4">
            <label htmlFor="direccionEnvio" className="block text-gray-700 text-sm font-bold mb-2">
              Dirección de Envío:
            </label>
            <textarea
              id="direccionEnvio"
              value={direccionEnvio}
              onChange={(e) => setDireccionEnvio(e.target.value)}
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingresa tu dirección de envío"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="metodoPago" className="block text-gray-700 text-sm font-bold mb-2">
              Método de Pago:
            </label>
            <input
              type="text"
              id="metodoPago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Efectivo, Tarjeta, etc."
              required
            />
          </div>
          {mensaje && <pre className="text-red-500 text-sm mb-2 whitespace-pre-wrap">{mensaje}</pre>}
          <button
            onClick={realizarPedido}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Realizar Pedido
          </button>
        </div>
      )}

      <div className="mt-6 flex justify-start">
        <Link to="/menu" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded">
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
};

export default CarritoCompras;