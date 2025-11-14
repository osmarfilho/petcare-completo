import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPrivate } from "../lib/api";

type Ong = {
  id: number;
  nome: string;
  endereco: string;
  contato: string;
  created_at: string; 
};

export const OngList = () => {
  const navigate = useNavigate();
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOngs = async () => {
      try {
        setLoading(true);
        const response = await apiPrivate.get("/api/v1/ongs/");
        const data = response.data.results || response.data;
        
        if (Array.isArray(data)) {
            setOngs(data);
        } else {
            console.warn("API de ONGs não retornou um array:", data);
            setOngs([]);
        }

      } catch (err) {
        console.error("Erro ao buscar ONGs:", err);
        setError("Não foi possível carregar a lista de ONGs.");
      } finally {
        setLoading(false);
      }
    };
    fetchOngs();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta ONG?")) {
      return;
    }

    try {
      await apiPrivate.delete(`/api/v1/ongs/${id}/`);
      setOngs(ongs.filter((ong) => ong.id !== id));
    } catch (err) {
      console.error("Erro ao excluir ONG:", err);
      setError("Não foi possível excluir a ONG.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Carregando ONGs...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
  
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gerenciamento de ONGs
        </h1>
        <Link
          to="/ongs/novo"
          className="px-6 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 shadow-lg"
        >
          + Cadastrar ONG
        </Link>
      </div>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-xl border">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-bold text-gray-700">Nome</th>
              <th className="p-4 text-left font-bold text-gray-700">Endereço</th>
              <th className="p-4 text-left font-bold text-gray-700">Contato</th>
              <th className="p-4 text-left font-bold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {ongs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Nenhuma ONG cadastrada.
                </td>
              </tr>
            ) : (
              ongs.map((ong) => (
                <tr key={ong.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{ong.nome}</td>
                  <td className="p-4">{ong.endereco}</td>
                  <td className="p-4">{ong.contato}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => navigate(`/ongs/editar/${ong.id}`)}
                      className="px-3 py-1 text-sm text-white bg-yellow-500 rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ong.id)}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <Link
          to="/" 
          className="px-6 py-2 font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-md"
        >
                    ⬅ Voltar ao Painel
        </Link>
      </div>

    </div>
  );
};