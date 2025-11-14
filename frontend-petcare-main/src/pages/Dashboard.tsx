import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-3 items-center mb-6">
        <div></div>

        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Painel Principal PetCare 🐾
        </h1>

        <div className="justify-self-end">
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none"
          >
            Sair (Logout)
          </button>
        </div>
      </div>

      <p className="text-gray-600 text-center mb-10">
        Bem-vindo ao PetCare! Aqui você pode cadastrar e gerenciar os animais,
        os adotantes, as consultas e as ONGs da sua organização.
      </p>
      <div className="flex flex-col gap-10">
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Gerenciamento de Animais 🐕
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate("/animais/novo")}
              className="bg-green-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition shadow-md"
            >
              ➕ Cadastrar Animal
            </button>

            <button
              onClick={() => navigate("/animais")}
              className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition shadow-md"
            >
              📋 Ver Lista de Animais
            </button>
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Gerenciamento de Adotantes 🧑‍🤝‍🧑
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate("/adotantes/novo")}
              className="bg-purple-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-purple-700 transition shadow-md"
            >
              👤 Cadastrar Adotante
            </button>

            <button
              onClick={() => navigate("/adotantes")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              📋 Ver Lista de Adotantes
            </button>
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Consultas Veterinárias 🩺
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate("/consultas/novo")}
              className="bg-pink-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-pink-700 transition shadow-md"
            >
              ➕ Cadastrar Consulta
            </button>

            <button
              onClick={() => navigate("/consultas")}
              className="bg-rose-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-rose-700 transition shadow-md"
            >
              📅 Ver Lista de Consultas
            </button>
          </div>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Gerenciamento de ONGs 🏠
          </h2>
          <div className="flex justify-center gap-6 flex-wrap">
            <button
              onClick={() => navigate("/ongs/novo")}
              className="bg-teal-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-teal-700 transition shadow-md"
            >
              ➕ Cadastrar ONG
            </button>

            <button
              onClick={() => navigate("/ongs")}
              className="bg-cyan-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-cyan-700 transition shadow-md"
            >
              🏢 Ver Lista de ONGs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
