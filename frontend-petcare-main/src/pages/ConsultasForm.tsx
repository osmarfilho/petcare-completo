import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiPrivate } from "../lib/api";
import { type Animal, type ConsultaPayload, type Consulta } from "../types";

type FormDataState = ConsultaPayload & { id?: number };

// CORREÇÃO: Usar null para animal_id, pois 0 está reservado para a opção 'disabled'
const INITIAL_FORM_STATE: Omit<ConsultaPayload, 'animal_id'> & { animal_id: number | null } = {
    data: new Date().toISOString().split('T')[0],
    veterinario: "",
    observacoes: "",
    animal_id: null, // Alterado de 0 para null
};

export const ConsultaForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    // Garante que o estado use null no animal_id se não for edição, caso contrário, 0 é aceitável na edição
    const [formData, setFormData] = useState<FormDataState>({
        ...INITIAL_FORM_STATE,
        animal_id: isEditing ? 0 : null,
    } as FormDataState); // Forçamos o casting, pois o useEffect vai resolver o tipo

    const [animais, setAnimais] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                setFetchingData(true);
                setError(null);

                // 1. Buscar lista de animais (para o Select)
                const animalApiUrl = isEditing
                    ? "/api/v1/animais/"
                    : "/api/v1/animais/?adotado=false";

                const responseAnimais = await apiPrivate.get(animalApiUrl);
                const responseData = responseAnimais.data;

                let animaisList: Animal[] = [];

                if (responseData && Array.isArray(responseData.results)) {
                    animaisList = responseData.results;
                } else if (responseData && Array.isArray(responseData)) {
                    animaisList = responseData;
                }

                setAnimais(animaisList);

                if (animaisList.length === 0 && !isEditing) {
                    setError("Nenhum animal disponível para agendamento. Cadastre um animal primeiro.");
                    setFetchingData(false);
                    return;
                }

                // 2. Se estiver editando, buscar dados da consulta
                if (isEditing) {
                    const consultaId = Number(id);
                    const responseConsulta = await apiPrivate.get<Consulta>(`/api/v1/consultas/${consultaId}/`);
                    const consultaData = responseConsulta.data;

                    const dataFormatada = consultaData.data.split('T')[0];

                    setFormData({
                        id: consultaData.id,
                        data: dataFormatada,
                        veterinario: consultaData.veterinario || "",
                        observacoes: consultaData.observacoes || "",
                        animal_id: consultaData.animal_id, 
                    });

                } else if (animaisList.length > 0) {
                    // Se estiver criando e houver animais, preenche com o ID do primeiro animal.
                    setFormData((prev) => ({
                        ...prev,
                        animal_id: animaisList[0].id,
                    }));
                }

            } catch (err: any) {
                console.error("Erro ao carregar dados:", err);

                // ✅ TRATAMENTO ESPECÍFICO PARA ERRO 404 (pk não encontrado)
                if (err.response?.status === 404 && isEditing) {
                    setError(`Consulta com ID ${id} não encontrada. O registro pode ter sido excluído.`);
                } else if (err.response?.status === 401) {
                    setError("Sua sessão expirou. Por favor, faça login novamente.");
                } else {
                    setError("Não foi possível carregar os dados necessários. Tente novamente.");
                }

            } finally {
                setFetchingData(false);
            }
        };

        loadAllData();
    }, [id, isEditing, navigate]); // Dependências do useEffect

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        // Se for 'animal_id', garantimos que o valor seja numérico (ou null se for a opção placeholder 0)
        const newValue = name === "animal_id" ? (value === '0' ? null : Number(value)) : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        // CORREÇÃO: Verifica se o animal_id é null ou 0
        if (!formData.animal_id || formData.animal_id === 0) {
            setError("Por favor, selecione um animal.");
            return;
        }

        if (!formData.veterinario.trim()) {
            setError("O nome do veterinário é obrigatório.");
            return;
        }

        const payload: ConsultaPayload = {
            data: formData.data,
            veterinario: formData.veterinario, 
            observacoes: formData.observacoes,
            animal_id: formData.animal_id,
        };

        try {
            setLoading(true);

            const url = isEditing
                ? `/api/v1/consultas/${formData.id}/`
                : "/api/v1/consultas/";

            const method = isEditing ? "put" : "post";

            await apiPrivate({ url, method, data: payload });

            navigate("/consultas");

        } catch (err: any) {
            console.error("Erro ao salvar consulta:", err);

            const detailError = err.response?.data?.detail;
            const fieldsErrors = Object.values(err.response?.data || {}).flat().join("; ");

            const msg =
                detailError ||
                fieldsErrors ||
                `Erro ao ${isEditing ? "atualizar" : "agendar"} a consulta.`;

            setError(msg);

        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="p-8 text-center text-xl font-medium text-blue-600">
                Carregando dados...
            </div>
        );
    }

    if (animais.length === 0 && !isEditing) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center text-red-700 bg-red-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">🚨 ERRO DE DEPENDÊNCIA</h1>
                <p>Nenhum animal foi encontrado. Você precisa cadastrar animais (não adotados) para agendar novas consultas.</p>
                <button
                    onClick={() => navigate("/animais/novo")}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                    Cadastrar Animal
                </button>
            </div>
        );
    }
    
    // ✅ Nova verificação para erros críticos de carregamento (como 404)
    if (error && isEditing && !formData.animal_id) { // Usamos !formData.animal_id para pegar null e 0
        return (
            <div className="p-8 max-w-2xl mx-auto text-center text-red-700 bg-red-100 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">❌ ERRO</h1>
                <p className="mb-4">{error}</p>
                <button
                    onClick={() => navigate("/consultas")}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                    Voltar para a Lista de Consultas
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                {isEditing ? "Editar Consulta" : "Agendar Nova Consulta"}
            </h1>

            <form
                onSubmit={handleSubmit}
                className="p-8 bg-white rounded-lg shadow-xl space-y-5 border border-gray-100"
            >

                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Animal:
                    </label>

                    <select
                        name="animal_id"
                        // CORREÇÃO: Usamos || "" aqui para que o valor null seja renderizado como string vazia,
                        // permitindo a opção disabled=true ser selecionada quando o estado é null.
                        value={formData.animal_id || ""} 
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:ring-green-500 focus:border-green-500"
                        required
                        style={{ pointerEvents: isEditing ? "none" : "auto", opacity: isEditing ? 0.6 : 1 }}
                    >
                        {/* A opção placeholder deve ter value="" ou value={0}. 
                            Usaremos value="" (string vazia) para melhor compatibilidade com o required 
                            e inicialização nula no React. */}
                        <option value="" disabled> 
                            Selecione o Animal
                        </option>

                        {animais.map((animal) => (
                            <option key={animal.id} value={animal.id}>
                                {animal.nome} ({animal.especie})
                            </option>
                        ))}
                    </select>

                    {isEditing && (
                        <p className="text-xs text-gray-500 mt-1">
                            O animal não pode ser alterado após o agendamento.
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Data da Consulta:
                    </label>
                    <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Nome do Veterinário:
                    </label>
                    <input
                        type="text"
                        name="veterinario"
                        value={formData.veterinario}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        required
                        placeholder="Dr.(a) Nome Sobrenome"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                        Observações/Diagnóstico:
                    </label>
                    <textarea
                        name="observacoes"
                        value={formData.observacoes || ""}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Sintomas, diagnóstico, receitas, etc."
                    ></textarea>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/consultas")}
                        className="px-6 py-2 font-bold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150 shadow-md"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={loading || (animais.length === 0 && !isEditing)}
                        className="px-6 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 shadow-lg disabled:bg-gray-400"
                    >
                        {loading
                            ? isEditing
                                ? "Atualizando..."
                                : "Agendando..."
                            : isEditing
                                ? "Salvar Edição"
                                : "Agendar Consulta"}
                    </button>
                </div>
            </form>
        </div>
    );
};