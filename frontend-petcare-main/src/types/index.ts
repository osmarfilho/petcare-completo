
interface BaseModel {
  id: number;
  created_at: string; 
}

export interface Adotante extends BaseModel {
  nome: string;
  cpf: string;
  endereco: string;
  email: string;
  telefone: string;
}

export interface AdotantePayload {
  nome: string;
  cpf: string;
  endereco: string;
  email: string;
  telefone: string;
}

export interface ONG extends BaseModel {
  nome: string;
  endereco: string;
  contato: string;
}

export interface Animal extends BaseModel {
  nome: string;
  idade: number;
  especie: "cachorro" | "gato" | "outro";
  adotado: boolean;
  ong_id: number; 
  ong_nome?: string; 
  adotante_id: number | null;
  adotante_nome?: string | null; 
}

export type AnimalPayload = {
  nome: string;
  idade: number;
  especie: "cachorro" | "gato" | "outro";
  adotado: boolean;
  ong: number; 
  adotante?: number | null;
};


export interface ConsultaPayload {
  data: string; 
  veterinario: string;
  observacoes: string | null;
  animal_id: number; 
}

export interface Consulta extends BaseModel {
  data: string;
  veterinario: string;
  observacoes: string | null;
  animal_nome: string; 
  animal_id: number;   
}
