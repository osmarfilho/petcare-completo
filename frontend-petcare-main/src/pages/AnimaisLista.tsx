import { useEffect, useState } from "react";
import { apiPrivate } from "../lib/api";
import { type Animal } from "../types";
import { useNavigate } from "react-router-dom";

interface AnimalComDetalhes extends Animal {
  id: number;
  created_at: string;
  ong_nome?: string;
}

export const AnimaisLista = () => {
  const [animais, setAnimais] = useState<AnimalComDetalhes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAnimais = async () => {
    try {
      setLoading(true);
      const response = await apiPrivate.get("/api/v1/animais/");
      setAnimais(response.data.results || response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar animais:", err);
      setError("Não foi possível carregar os animais.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimais();
  }, []);

  const handleDelete = async (id: number, nome: string) => {
    if (!window.confirm(`Excluir o animal ${nome}?`)) return;
    try {
      setLoading(true);
      await apiPrivate.delete(`/api/v1/animais/${id}/`);
      setAnimais(animais.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erro ao excluir animal:", err);
      setError("Não foi possível excluir o animal.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-indigo-600 font-medium">Carregando animais...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Animais 🐾</h1>
        <button
          onClick={() => navigate("/animais/novo")}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          ➕ Novo Animal
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Espécie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adotado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ONG</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {animais.map((animal) => (
              <tr key={animal.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{animal.nome}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{animal.especie}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{animal.idade}</td>
                <td className="px-6 py-4 text-sm text-center">
                  {animal.adotado ? "✅" : "❌"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{animal.ong_nome || "N/A"}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => navigate(`/animais/editar/${animal.id}`)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(animal.id, animal.nome)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          ⬅ Voltar ao Painel
        </button>
      </div>
    </div>
  );
};
