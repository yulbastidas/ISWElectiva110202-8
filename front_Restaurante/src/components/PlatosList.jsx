import { useState, useEffect } from "react";
import axios from "axios";
import AddPlato from "./AddPlato";
import EditPlato from "./EditPlato";

const ListaPlatos = () => {
    const [platos, setPlatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarAgregarPlato, setMostrarAgregarPlato] = useState(false);
    const [mostrarEditarPlato, setMostrarEditarPlato] = useState(false);
    const [platoSeleccionado, setPlatoSeleccionado] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/restaurante/")
            .then((response) => {
                setPlatos(response.data.platos);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al obtener los platos:", error);
                setError("No se pudieron cargar los platos.");
                setCargando(false);
            });
    }, []);

    const manejarAgregarPlato = (nuevoPlato) => {
        setPlatos((prev) => [...prev, nuevoPlato]);
    };

    const manejarEditarPlato = (plato) => {
        setPlatos((prev) =>
            prev.map((p) => (p.nombre === plato.nombre ? plato : p))
        );
        setMostrarEditarPlato(false);
        setPlatoSeleccionado(null);
    };

    const manejarEliminarPlato = (nombre) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este plato?")) return;

        axios.delete(`http://127.0.0.1:8000/api/restaurante/${encodeURIComponent(nombre)}/`)
            .then(() => {
                setPlatos((prev) => prev.filter((plato) => plato.nombre !== nombre));
            })
            .catch((error) => {
                console.error("Error al eliminar el plato:", error);
                setError("No se pudo eliminar el plato.");
            });
    };

    const manejarEditarClick = (plato) => {
        setPlatoSeleccionado(plato);
        setMostrarEditarPlato(true);
    };

    if (cargando) return <p className="text-center text-gray-500">Cargando platos...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            {/* Cuadro rojo con el logo y la frase */}
            <div className="flex flex-col items-center bg-red-600 text-white py-6 px-4 w-full">
                <div className="w-full h-40 bg-red-800 flex items-center justify-center mb-4">
                    <span className="text-white text-4xl font-bold">Cuy Logo</span>
                </div>
                <h2 className="text-xl font-bold">"UN MUNDO LLENO DE SABOR"</h2>
                <a href="#platos"
                   className="mt-4 px-6 py-2 bg-[#5E2A00] text-white rounded-lg hover:bg-[#432001] transition w-full text-center">
                   Te invitamos a conocer nuestros platos
                </a>
            </div>

            {/* Lista de Platos */}
            <div id="platos" className="max-w-6xl mx-auto mt-14 p-5 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">🍽️ Nuestros Platos</h2>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setMostrarAgregarPlato(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        + Agregar Plato
                    </button>
                </div>

                {platos.length === 0 ? (
                    <p className="text-center text-gray-500">No hay platos disponibles.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {platos.map((plato) => (
                            <div key={plato.id} className="border rounded-lg shadow-sm hover:shadow-lg transition p-4 flex flex-col items-center">
                                {/* Espacio para imagen */}
                                <div className="w-full h-40 bg-gray-100 mb-3 flex items-center justify-center">
                                    <span className="text-gray-400">[Imagen]</span>
                                </div>
                                <h3 className="text-lg font-semibold text-center">{plato.nombre}</h3>
                                <p className="text-gray-600 text-center mt-1">{plato.descripcion}</p>
                                <p className="font-bold text-green-600 mt-2">${plato.precio}</p>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => manejarEditarClick(plato)}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => manejarEliminarPlato(plato.nombre)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                    {/* Botón para añadir al carrito */}
                                    <button
                                        onClick={() => alert(`Plato ${plato.nombre} añadido al carrito`)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {mostrarAgregarPlato && (
                    <AddPlato
                        onClose={() => setMostrarAgregarPlato(false)}
                        onAddPlato={manejarAgregarPlato}
                    />
                )}

                {mostrarEditarPlato && platoSeleccionado && (
                    <EditPlato
                        plato={platoSeleccionado}
                        onClose={() => setMostrarEditarPlato(false)}
                        onUpdatePlato={manejarEditarPlato}
                    />
                )}
            </div>
        </div>
    );
};

export default ListaPlatos;
