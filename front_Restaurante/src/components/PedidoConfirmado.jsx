// PedidoConfirmado.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PedidoConfirmado = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md text-center">
      <h2 className="text-2xl font-semibold text-green-600 mb-4">¡Pedido Confirmado!</h2>
      <p className="text-gray-700 mb-4">
        Gracias por tu pedido. Lo estamos procesando y te informaremos sobre el estado de tu entrega.
      </p>
      <Link to="/menu" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Volver al Menú
      </Link>
    </div>
  );
};

export default PedidoConfirmado;