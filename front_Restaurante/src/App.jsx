import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import PlatosList from "./components/PlatosList.jsx"; // ✅ Importa la lista de platos
import Navbar from "./components/Navbar.jsx"; // ✅ Importa el navbar

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ Barra de navegación */}
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/platos" element={<PlatosList />} /> {/* ✅ Ruta principal para platos */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
