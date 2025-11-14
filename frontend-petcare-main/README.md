# PetCare 

O PetCare Dashboard é uma aplicação web completa desenvolvida em React e TypeScript, destinada à administração e gerenciamento de clínicas veterinárias, abrigos de animais e ONGs de adoção. O sistema implementa um fluxo de autenticação seguro via JWT e fornece operações CRUD (Criar, Ler, Atualizar, Deletar) para gerenciar todas as entidades cruciais do negócio.

**✨ Funcionalidades Principais (CRUD)**
O sistema oferece gerenciamento completo para as seguintes entidades:

**Animais:** Cadastro, edição, listagem e exclusão de animais.

**Adotantes:** Gerenciamento dos dados pessoais de indivíduos interessados em adoção.

**Consultas Veterinárias:** Agendamento, alteração e histórico de consultas.

**ONGs:** Gerenciamento das organizações e abrigos parceiros.

**🚀 Tecnologias Utilizadas**

Este projeto foi construído com foco em performance, escalabilidade e manutenibilidade, utilizando as seguintes tecnologias:

**Frontend:**

   **React:** Biblioteca principal para a construção da interface.

   **TypeScript:** Adiciona tipagem estática, aumentando a segurança e a qualidade do código.

   **React Router DOM:** Para gerenciamento de rotas e navegação.

   **Axios:** Cliente HTTP configurado para requisições com autenticação JWT.

   **Tailwind CSS (ou similar):** Para estilos rápidos e responsivos.

  **React Toastify:** Para notificações de feedback ao usuário (sucesso/erro).

**Backend (Conexão):**

   **API RESTful:** O frontend se conecta a um backend Django/Django REST Framework (implícito).

**Autenticação:**

   **JSON Web Tokens (JWT):** Utilizado para autenticar o usuário e proteger as rotas da API.

   **JSON Web Tokens (JWT):** Utilizado para autenticar o usuário e proteger as rotas da API.

**📐 Arquitetura do Projeto**

A arquitetura do frontend é organizada para promover a reutilização de código e a separação de responsabilidades:

    src/context - Contém o AuthContext, responsável por gerenciar o estado de autenticação (JWT) e prover as funções de login e logout.
    src/lib/api.ts - Instância configurada do Axios (apiPrivate) que injeta o token JWT em cada requisição (Interceptor), garantindo o acesso às rotas protegidas.
    src/hooks - Inclui o custom hook useAuth para acesso simplificado ao contexto de autenticação em qualquer componente.
    src/pages - Contém as páginas principais (e.g., Login.tsx, Dashboard.tsx) e as telas de CRUD (e.g., AnimaisLista, ConsultaForm).
    src/types - Definições de interfaces TypeScript para todas as entidades (Animal, Consulta, ONG, Adotante) e payloads de API.

🔑 Autenticação e Rotas Protegidas

O fluxo de autenticação é implementado de forma segura e eficiente:

   1. Login (Login.tsx): O usuário envia credenciais para a API.
   2. Geração do Token: A API retorna o token JWT em caso de sucesso.
   3. Armazenamento: O AuthContext armazena o token e o salva no localStorage.
   4. Middleware de Roteamento: As rotas administrativas são envolvidas por um componente que verifica a presença e validade do token. Se o token não estiver presente, o usuário é redirecionado para a tela de Login.



🛠️ Instalação e Execução

Para configurar e rodar o projeto em sua máquina local, siga os passos abaixo:

**Pré-requisitos**

Certifique-se de ter o Node.js e o npm (ou yarn) instalados.

  **1. Clonar o Repositório**
  
      git clone [https://github.com/osmarfilho/frontend-petcare.git](https://github.com/osmarfilho/frontend-petcare.git)
      cd frontend-petcare
      
 **2. Instalar Dependências**
 
      npm install
      # ou
      yarn install

 **3. Executar o Projeto**

     npm run dev
     # ou 
     yarn dev

O dashboard estará acessível em http://localhost:5173 (ou porta padrão).
     
     
     
                                                                         
