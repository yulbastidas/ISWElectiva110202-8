import { useState } from "react";
import axios from "axios";

const AddPlato = ({ onClose, onAddPlato }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "ENTRADA",
    precio: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const categoriaOptions = [
    { value: "ENTRADA", label: "Entrada" },
    { value: "PRINCIPAL", label: "Principal" },
    { value: "POSTRE", label: "Postre" },
    { value: "BEBIDA", label: "Bebida" }
  ];

  const validateForm = () => {
    let errors = {};

    if (formData.nombre.length > 50) {
      errors.nombre = "El nombre no puede superar los 50 caracteres.";
    }

    if (isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      errors.precio = "El precio debe ser un número positivo.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/restaurante/", formData);
      onAddPlato(response.data);
      onClose();
    } catch (error) {
      console.error("Error al agregar el plato:", error);
      setError("No se pudo agregar el plato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Agregar Plato</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del Plato"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            {validationErrors.nombre && <p className="text-red-500 text-sm">{validationErrors.nombre}</p>}
          </div>
          <div>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              {categoriaOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              name="precio"
              placeholder="Precio"
              step="0.01"
              value={formData.precio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              min="0.01"
            />
            {validationErrors.precio && <p className="text-red-500 text-sm">{validationErrors.precio}</p>}
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlato;
