# CME Fullstack Challenge 🚀

Este é um sistema completo para rastreabilidade de materiais em uma Central de Material Esterilizado (CME), com backend em Django e frontend em React + TypeScript.

## 🧰 Tecnologias Utilizadas

### Backend (API)
- **Django 4.1+**
- **Django REST Framework**
- **PostgreSQL**
- **Docker**
- **Swagger** para documentação da API
- **Padrões seguidos:** arquitetura baseada em ViewSets, Services e Serializers organizados.

### Frontend
- **React**
- **TypeScript**
- **TailwindCSS**
- **Axios** (para requisições à API)
- **React Router**

## 🐳 Como Executar o Projeto com Docker

### Requisitos:
- Docker e Docker Compose instalados

### Etapas:

1. Clone o repositório:
   ```bash
   git clone https://github.com/AdrianoEusebio/cme_fullstack.git
   cd seu-projeto

2. Suba os containers:
   ```bash
   docker-compose up --build

3. Acesse

   Backend: http://localhost:8000/swagger

   Frontend: http://localhost:5173/login

   Admin Django: http://localhost:8000/admin





## 🔑 Credenciais Padrão (Superusuário Django)
   ```bash
   Usuário: admin
   Senha: admin123
   ```


## 🔁 Principais Funcionalidades


### 1. 📥 Receiving
   Cadastro de seriais que ainda não entraram no fluxo.

   Pode receber múltiplos seriais ao mesmo tempo.



### 2. 🧽 Washing
   Apenas seriais com status RECEIVING são exibidos.

   Confirmação de sucesso ou falha no processo.



### 3. 🔥 Esterilization
   Apenas seriais com status WASHING COMPLETE ou RECEIVING são listados.

   Confirmação de sucesso ou falha no processo.



### 4. 🚚 Distribution
   Distribui materiais para setores.

   Aceita seriais com status RECEIVING, WASHING COMPLETE ou ESTERELIZATION.



### 5. 📜 Histórico de Processos


   Toda ação feita em uma etapa é registrada.

   O histórico pode ser filtrado por: SERIAL



## 📎 Observações


   A aplicação segue um fluxo fixo de etapas.
   
   Cada serial possui um status que é automaticamente atualizado.

O backend possui propriedades úteis nas models para calcular etapas restantes, status atual e validações automáticas.




