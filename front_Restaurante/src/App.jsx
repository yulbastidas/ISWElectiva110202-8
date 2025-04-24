import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import PlatosList from "./components/PlatosList.jsx";
import Navbar from "./components/Navbar.jsx";
import PasswordReset from "./components/PasswordReset.jsx"; 
import PasswordVerify from "./components/PasswordVerify.jsx"; // Asegúrate de importar el componente de verificación

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/platos" element={<PlatosList />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/password-verify" element={<PasswordVerify />} /> {/* Asegúrate de agregar esta ruta */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;