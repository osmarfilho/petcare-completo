import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoutes } from "./components/ProtectedRoutes";
import { AnimaisLista } from "./pages/AnimaisLista";
import { AnimalForm } from "./pages/AnimalForm";
import { AdotanteForm } from "./pages/AdotanteForm";
import { AdotantesList } from "./pages/AdotantesList";
import { ConsultasLista } from "./pages/ConsultasListas"; 
import { ConsultaForm } from "./pages/ConsultasForm";
import { OngList } from "./pages/OngList";
import { OngForm } from "./pages/OngForm";

function App() {
 return (
  <Routes>
   <Route path="/login" element={<Login />} />
   <Route element={<ProtectedRoutes />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/animais" element={<AnimaisLista />} />
    <Route path="/animais/novo" element={<AnimalForm />} />
    <Route path="/animais/editar/:id" element={<AnimalForm />} />
    <Route path="/adotantes" element={<AdotantesList />} />
    <Route path="/adotantes/novo" element={<AdotanteForm />} />
    <Route path="/adotantes/editar/:id" element={<AdotanteForm />} />
    <Route path="/consultas" element={<ConsultasLista />} />
    <Route path="/consultas/novo" element={<ConsultaForm />} />
    <Route path="/consultas/editar/:id" element={<ConsultaForm />} />
    <Route path="/ongs" element={<OngList />} />
    <Route path="/ongs/novo" element={<OngForm />} />
    <Route path="/ongs/editar/:id" element={<OngForm />} />
   </Route>
  </Routes>
 );
}

export default App;