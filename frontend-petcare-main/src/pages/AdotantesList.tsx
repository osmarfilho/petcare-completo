import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPrivate } from "../lib/api";
import { type AdotantePayload } from "../types";

interface Adotante extends AdotantePayload {
  id: number;
  created_at: string;
}

export const AdotantesList = () => {
  const [adotantes, setAdotantes] = useState<Adotante[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAdotantes = async () => {
    try {
      setLoading(true);
      const response = await apiPrivate.get("/api/v1/adotantes/");
      setAdotantes(response.data.results || response.data);
      setErro(null);
    } catch (err) {
      console.error("Erro ao buscar adotantes:", err);
      setErro(
        "Não foi possível carregar a lista de adotantes. Verifique o servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdotantes();
  }, []);

  const handleDelete = async (id: number, nome: string) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir o adotante ${nome}? Esta ação é irreversível.`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await apiPrivate.delete(`/api/v1/adotantes/${id}/`);
      alert(`Adotante ${nome} excluído com sucesso!`);
      setAdotantes((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erro ao excluir adotante:", err);
      setErro("Não foi possível excluir o adotante. Verifique as permissões.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando adotantes...</div>;
  }

  if (erro) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">{erro}</div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Lista de Adotantes Cadastrados 🧑‍🤝‍🧑
        </h1>
        <button
          onClick={() => navigate("/adotantes/novo")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          ➕ Novo Adotante
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cadastrado em
              </th>
              <th className="px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {adotantes.map((adotante) => (
              <tr key={adotante.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {adotante.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adotante.cpf}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adotante.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {adotante.telefone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(adotante.created_at).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/adotantes/editar/${adotante.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 ml-4 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(adotante.id, adotante.nome)}
                    className="text-red-600 hover:text-red-900"
                    disabled={loading}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          ⬅ Voltar ao Painel
        </button>
      </div>
    </div>
  );
};
