import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPrivate } from "../lib/api";
import { toast } from "react-toastify";

interface Consulta {
  id: number;
  animal: number;
  animal_nome?: string; 
  data: string;
  veterinario: string;
  observacoes?: string;
}

export const ConsultasLista = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConsultas = async () => {
    try {
      setLoading(true);
      const response = await apiPrivate.get("/api/v1/consultas/");
      const data = response.data.results || response.data; 
      setConsultas(data);
    } catch (err) {
      console.error("Erro ao buscar consultas:", err);
      toast.error("Erro ao carregar consultas. Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleDelete = async (id: number, animalNome?: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a consulta do animal "${animalNome || id}"?`)) {
      return;
    }

    try {
      await apiPrivate.delete(`/api/v1/consultas/${id}/`);
      setConsultas((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Consulta de "${animalNome || "animal"}" excluída com sucesso!`);
    } catch (err) {
      console.error("Erro ao excluir consulta:", err);
      toast.error("Erro ao excluir consulta. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xl font-medium text-blue-600">
        Carregando consultas...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Consultas Veterinárias 🩺
        </h1>
        <button
          onClick={() => navigate("/consultas/novo")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          ➕ Agendar Nova Consulta
        </button>
      </div>

      {consultas.length === 0 ? (
        <div className="p-8 text-center text-gray-600 bg-gray-50 rounded-lg shadow-inner">
          Nenhuma consulta agendada ainda.
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data e Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veterinário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultas.map((consulta) => (
                <tr
                  key={consulta.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {consulta.animal_nome || `Animal #${consulta.animal}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(consulta.data).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {consulta.veterinario}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {consulta.observacoes || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 text-center">
                    <button
                      onClick={() =>
                        navigate(`/consultas/editar/${consulta.id}`)
                      }
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-100 hover:bg-blue-200 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(consulta.id, consulta.animal_nome)
                      }
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 transition"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition shadow-md"
        >
          ⬅ Voltar ao Painel
        </button>
      </div>
    </div>
  );
};
