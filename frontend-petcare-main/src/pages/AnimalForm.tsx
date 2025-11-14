import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPrivate } from "../lib/api";
import { type ONG, type AnimalPayload, type Animal } from "../types"; 

// Ajuste o tipo para incluir os campos que você usa internamente
type FormDataState = AnimalPayload & { id?: number; ong_id: number };

export const AnimalForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const [formData, setFormData] = useState<FormDataState>({
        nome: "",
        idade: 0, // Idade inicializada como 0
        especie: "cachorro",
        adotado: false,
        ong: 0,
        ong_id: 0,
        adotante: null,
    });

    const [ongs, setOngs] = useState<ONG[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingOngs, setFetchingOngs] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Efeito para buscar ONGs
    useEffect(() => {
        const fetchOngs = async () => {
            try {
                setFetchingOngs(true);
                const response = await apiPrivate.get("/api/v1/ongs/");
                const data: ONG[] = response.data.results || response.data;
                setOngs(data);

                if (!isEditing && data.length > 0 && formData.ong_id === 0) {
                    // Define a primeira ONG como padrão na criação
                    setFormData((prev) => ({ ...prev, ong: data[0].id, ong_id: data[0].id }));
                }
            } catch (err) {
                console.error("Erro ao buscar ONGs:", err);
                setError("Não foi possível carregar as ONGs.");
            } finally {
                setFetchingOngs(false);
            }
        };
        fetchOngs();
    }, [isEditing]);

    // Efeito para carregar dados do Animal em modo de edição
    useEffect(() => {
        if (isEditing) {
            const animalId = Number(id);
            const fetchAnimalData = async () => {
                try {
                    setLoading(true);
                    const response = await apiPrivate.get<Animal>(`/api/v1/animais/${animalId}/`);
                    const animalData = response.data;

                    const initialData: AnimalPayload = {
                        nome: animalData.nome,
                        idade: animalData.idade,
                        especie: animalData.especie,
                        adotado: animalData.adotado,
                        ong: animalData.ong_id, 
                        adotante: animalData.adotante_id,
                    };

                    setFormData({ ...initialData, id: animalId, ong_id: animalData.ong_id });
                } catch (err) {
                    console.error("Erro ao carregar dados do animal:", err);
                    setError("Não foi possível carregar os dados para edição.");
                } finally {
                    setLoading(false);
                }
            };
            fetchAnimalData();
        }
    }, [id, isEditing]);

    // Lida com mudanças nos inputs (incluindo conversão para int para IDs e Idade)
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === "checkbox";

        setFormData((prev) => {
            let newValue: string | number | boolean | null;
            
            if (isCheckbox) {
                newValue = (e.target as HTMLInputElement).checked;
            } else if (name === "idade" || name === "ong" || name === "ong_id") {
                newValue = parseInt(value) || 0;
            } else {
                newValue = value;
            }
            return { ...prev, [name]: newValue };
        });
    };

    // Lida com o envio do formulário
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.nome.trim() || formData.ong_id === 0) {
            setError("Preencha o nome do animal e selecione uma ONG válida.");
            return;
        }

        const payload: AnimalPayload = {
            nome: formData.nome.trim(),
            idade: Math.max(0, formData.idade),
            especie: formData.especie,
            adotado: formData.adotado,
            ong: formData.ong_id, 
            adotante: formData.adotante ?? null,
        };

        try {
            setLoading(true);

            const url = isEditing ? `/api/v1/animais/${formData.id}/` : "/api/v1/animais/";
            const method = isEditing ? "put" : "post";

            const response = await apiPrivate({ url, method, data: payload });

            if (response.status === 200 || response.status === 201) {
                navigate("/animais");
            } else {
                throw new Error("Erro inesperado ao salvar o animal.");
            }
        } catch (err: any) {
            console.error("Erro ao salvar animal:", err);
            const msg =
                err.response?.data?.detail ||
                Object.values(err.response?.data || {}).flat().join("; ") ||
                `Erro ao ${isEditing ? "atualizar" : "cadastrar"} o animal.`;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingOngs || (isEditing && loading)) {
        return <div className="p-8 text-center text-blue-600 font-medium">Carregando dados...</div>;
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isEditing ? `Editar Animal: ${formData.nome}` : "Cadastrar Novo Animal 🐕"}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="p-8 bg-white rounded-lg shadow-xl space-y-5 border border-gray-100"
            >
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>}

                {/* Campo Nome */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Nome:</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        required
                    />
                </div>

                {/* Campo Idade (CORRIGIDO) */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Idade (anos):</label>
                    <input
                        type="number"
                        name="idade"
                        value={formData.idade} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        min="0"
                        // 'required' removido para permitir o valor 0 sem erro de validação do HTML.
                    />
                </div>

                {/* Campo Espécie */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">Espécie:</label>
                    <select
                        name="especie"
                        value={formData.especie}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                        <option value="cachorro">Cachorro</option>
                        <option value="gato">Gato</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                {/* Campo ONG */}
                <div>
                    <label className="block mb-2 font-semibold text-gray-700">ONG:</label>
                    <select
                        name="ong_id"
                        value={formData.ong_id}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                        required
                    >
                        <option value={0} disabled>
                            Selecione uma ONG
                        </option>
                        {ongs.map((ong) => (
                            <option key={ong.id} value={ong.id}>
                                {ong.nome}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campo Adotado */}
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="adotado"
                        checked={formData.adotado}
                        onChange={handleChange}
                        id="adotado-checkbox"
                        className="h-5 w-5 text-green-600 border-gray-300 rounded"
                    />
                    <label htmlFor="adotado-checkbox" className="text-sm font-semibold text-gray-700">
                        Já foi adotado?
                    </label>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/animais")}
                        className="px-6 py-2 font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {loading ? (isEditing ? "Atualizando..." : "Cadastrando...") : isEditing ? "Salvar" : "Cadastrar"}
                    </button>
                </div>
            </form>
        </div>
    );
};