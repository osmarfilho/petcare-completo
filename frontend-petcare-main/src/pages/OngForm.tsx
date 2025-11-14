import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPrivate } from "../lib/api";

type Ong = {
  id: number;
  nome: string;
  endereco: string;
  contato: string;
};

type FormDataState = Omit<Ong, 'id'>;

const INITIAL_FORM_STATE: FormDataState = {
  nome: "",
  endereco: "",
  contato: "",
};

export const OngForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing) {
      const fetchOngData = async () => {
        try {
          const response = await apiPrivate.get<Ong>(`/api/v1/ongs/${id}/`);
          const ongData = response.data;
          
          setFormData({
            nome: ongData.nome,
            endereco: ongData.endereco,
            contato: ongData.contato,
          });

        } catch (err) {
          console.error("Erro ao carregar ONG:", err);
          setError("Não foi possível carregar os dados da ONG para edição.");
        } finally {
          setFetchingData(false);
        }
      };
      fetchOngData();
    }
  }, [id, isEditing]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nome.trim() || !formData.endereco.trim()) {
      setError("O Nome e o Endereço são obrigatórios.");
      return;
    }

    try {
      setLoading(true);

      const url = isEditing
        ? `/api/v1/ongs/${id}/`
        : "/api/v1/ongs/";
      const method = isEditing ? "put" : "post";

      await apiPrivate({ url, method, data: formData });

      navigate("/ongs"); 

    } catch (err: any) {
      console.error("Erro ao salvar ONG:", err);
      const fieldsErrors = Object.values(err.response?.data || {}).flat().join('; ');
      setError(fieldsErrors || `Erro ao salvar a ONG.`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return <div className="p-8 text-center">Carregando dados da ONG...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {isEditing ? "Editar ONG" : "Cadastrar Nova ONG"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded-lg shadow-xl space-y-5"
      >
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Nome da ONG:
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Endereço:
          </label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-bold text-gray-700">
            Contato (Telefone/Email):
          </label>
          <input
            type="text"
            name="contato"
            value={formData.contato}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        
        {/* ==========================================================
          // ✅ BOTÕES ATUALIZADOS COM ESTILOS
          // ========================================================== */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/ongs")} 
            className="px-6 py-2 font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 shadow-lg disabled:bg-gray-400"
          >
            {loading ? "Salvando..." : (isEditing ? "Salvar Edição" : "Cadastrar ONG")}
          </button>
        </div>
      </form>
    </div>
  );
};