// PedidoConfirmado.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
// Importar jspdf-autotable como complemento (plugin)
// Necesitamos asegurarnos que la librería esté instalada: npm install jspdf-autotable
import 'jspdf-autotable';

const PedidoConfirmado = () => {
  const location = useLocation();
  const carrito = location.state?.carrito || [];
  const totalCarrito = location.state?.totalCarrito || 0;
  const impuestos = totalCarrito * 0.10; // Ejemplo de cálculo de impuestos (10%)
  const totalConImpuestos = totalCarrito + impuestos;

  const generarIdPedido = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}`;
  };

  const pedido = {
    id: generarIdPedido(),
    fecha: new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }),
    items: carrito.map(item => ({
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: parseFloat(item.precio), // Asegúrate de que el precio sea un número
    })),
    subtotal: totalCarrito,
    impuestos: impuestos,
    total: totalConImpuestos,
  };

  // Método alternativo para generar la factura sin usar autoTable
  const descargarFactura = () => {
    try {
      const doc = new jsPDF();

      // Título de la factura
      doc.setFontSize(18);
      doc.text('Factura de Pedido', 15, 15);

      // Detalles del pedido
      doc.setFontSize(12);
      doc.text(`Número de Pedido: ${pedido.id}`, 15, 30);
      doc.text(`Fecha: ${pedido.fecha}`, 15, 36);

      // Encabezados de la tabla (dibujados manualmente)
      doc.setFillColor(240, 240, 240);
      doc.rect(15, 45, 180, 8, 'F');
      doc.setFontSize(10);
      doc.text('Producto', 20, 50);
      doc.text('Cantidad', 80, 50);
      doc.text('Precio Unitario', 110, 50);
      doc.text('Subtotal', 160, 50);

      // Dibujar líneas de ítems
      let y = 55;
      pedido.items.forEach((item, index) => {
        doc.text(item.nombre, 20, y);
        doc.text(item.cantidad.toString(), 80, y);
        doc.text(`$${item.precioUnitario.toFixed(2)}`, 110, y);
        doc.text(`$${(item.cantidad * item.precioUnitario).toFixed(2)}`, 160, y);
        y += 8;
      });

      // Línea de separación
      y += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(15, y, 195, y);
      y += 10;

      // Totales
      doc.setFontSize(12);
      doc.text(`Subtotal: $${pedido.subtotal.toFixed(2)}`, 140, y);
      y += 6;
      doc.text(`Impuestos (10%): $${pedido.impuestos.toFixed(2)}`, 140, y);
      y += 6;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: $${pedido.total.toFixed(2)}`, 140, y);

      // Nombre del archivo
      const filename = `factura_pedido_${pedido.id}.pdf`;

      // Descargar el archivo
      doc.save(filename);

    } catch (error) {
      console.error('Error al generar la factura:', error);
      alert('Hubo un error al generar la factura. Por favor intenta de nuevo.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-2">¡Pedido Confirmado!</h2>
        <p className="text-gray-700 text-sm">Gracias por tu compra.</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Detalles del Pedido</h3>
        <p className="text-gray-600">Número de Pedido: <span className="font-medium">{pedido.id}</span></p>
        <p className="text-gray-600">Fecha: <span className="font-medium">{pedido.fecha}</span></p>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-5 py-3 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-5 py-3 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th className="px-5 py-3 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {pedido.items.map((item, index) => (
              <tr key={index}>
                <td className="px-5 py-2 border-b border-gray-200 text-sm">
                  {item.nombre}
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-right text-sm">
                  {item.cantidad}
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-right text-sm">
                  ${item.precioUnitario.toFixed(2)}
                </td>
                <td className="px-5 py-2 border-b border-gray-200 text-right text-sm">
                  ${(item.cantidad * item.precioUnitario).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="px-5 py-2 text-right text-sm font-semibold">Subtotal:</td>
              <td className="px-5 py-2 text-right text-sm">${pedido.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="px-5 py-2 text-right text-sm font-semibold">Impuestos (10%):</td>
              <td className="px-5 py-2 text-right text-sm">${pedido.impuestos.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan="3" className="px-5 py-2 text-right text-lg font-semibold">Total:</td>
              <td className="px-5 py-2 text-right text-lg font-semibold text-green-600">${pedido.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Link to="/menu" className="bg-gray-500 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Volver al Menú
        </Link>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={descargarFactura}
        >
          Descargar Factura
        </button>
      </div>
    </div>
  );
};

export default PedidoConfirmado;