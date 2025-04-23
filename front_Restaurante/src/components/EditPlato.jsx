import { useState } from "react";
import axios from "axios";

const EditPlato = ({ plato, onClose, onUpdatePlato }) => {
  const [formData, setFormData] = useState({
    nombre: plato.nombre,
    categoria: plato.categoria,
    precio: plato.precio,
    disponible: plato.disponible,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (formData.nombre.length > 30) newErrors.nombre = "Máximo 30 caracteres";
    const precioNumber = Number(formData.precio);
    if (precioNumber <= 0 || isNaN(precioNumber)) newErrors.precio = "Debe ser un número positivo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    console.log(formData); // Verifica que los datos estén correctos
  
    try {
      await axios.put(`http://127.0.0.1:8000/api/restaurante/${encodeURIComponent(formData.nombre)}/`, formData);


      onUpdatePlato(formData);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el plato:", error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">✏️ Editar Plato</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecciona una categoría</option>
              <option value="bebida">Bebida</option>
              <option value="plato">Plato</option>
              <option value="postre">Postre</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            {errors.precio && <p className="text-red-500 text-sm">{errors.precio}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="h-4 w-4 text-green-600"
            />
            <label className="text-sm font-medium text-gray-700">Disponible</label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlato;
