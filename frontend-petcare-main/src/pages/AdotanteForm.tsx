import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPrivate } from "../lib/api";

interface AdotanteFormData {
  nome: string;
  cpf: string;
  endereco: string;
  email: string;
  telefone: string;
}

export const AdotanteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [formData, setFormData] = useState<AdotanteFormData>({
    nome: "",
    cpf: "",
    endereco: "",
    email: "",
    telefone: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    if (id) {
      setModoEdicao(true);
      const fetchAdotante = async () => {
        try {
          setLoading(true);
          const response = await apiPrivate.get(`/api/v1/adotantes/${id}/`);
          setFormData(response.data);
        } catch (err) {
          console.error("Erro ao carregar adotante:", err);
          setErro("Não foi possível carregar os dados do adotante.");
        } finally {
          setLoading(false);
        }
      };
      fetchAdotante();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);
    setLoading(true);

    try {
      if (modoEdicao && id) {
        await apiPrivate.put(`/api/v1/adotantes/${id}/`, formData);
        setSucesso("Adotante atualizado com sucesso!");
      } else {
        await apiPrivate.post("/api/v1/adotantes/", formData);
        setSucesso("Adotante cadastrado com sucesso!");
      }

      setTimeout(() => {
        navigate("/adotantes");
      }, 1500);
    } catch (err: any) {
      console.error("Erro ao salvar adotante:", err);
      if (err.response?.data) {
        const detail =
          err.response.data.detail ||
          Object.values(err.response.data).join(" ") ||
          "Erro desconhecido no servidor.";
        setErro(`Erro ao salvar: ${detail}`);
      } else {
        setErro("Erro de rede. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {modoEdicao ? "Editar Adotante ✏️" : "Cadastrar Adotante 🐾"}
        </h1>

        {loading && modoEdicao && (
          <p className="text-center text-gray-600 mb-4">Carregando dados...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">CPF</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              required
              maxLength={14}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Telefone
            </label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Voltar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading
                ? "Salvando..."
                : modoEdicao
                ? "Atualizar"
                : "Cadastrar"}
            </button>
          </div>

          {erro && <p className="text-red-600 text-center mt-3">{erro}</p>}
          {sucesso && (
            <p className="text-green-600 text-center mt-3">{sucesso}</p>
          )}
        </form>
      </div>
    </div>
  );
};
