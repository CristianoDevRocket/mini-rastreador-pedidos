# Mini Rastreador de Pedidos

Sistema simplificado de rastreamento de pedidos de delivery: autenticação, criação de pedidos e acompanhamento de status.

## Stack

- **Backend:** Java 21, Spring Boot 3, Spring Security, Spring Data JPA, SQLite, JWT, BCrypt
- **Frontend:** React, Vite, React Router, Axios, Context API, Tailwind CSS

## Estrutura

- `backend/` — API REST (controller/service/repository/entity/dto/mapper/security/exception)
- `frontend/` — aplicação React (pages/components/context/services)

## Como rodar

### Backend (porta 8080)

```bash
cd backend
./mvnw spring-boot:run
```

Não requer Maven instalado (usa o Maven Wrapper). O banco SQLite (`pedidos.db`) é criado automaticamente na primeira execução.

### Frontend (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O backend precisa estar rodando em `http://localhost:8080` (CORS já liberado para essa origem).

### Testes do backend

```bash
cd backend
./mvnw test
```

21 testes: unitários (`PedidoService`, `AuthService`) e de integração (fluxo completo via `TestRestTemplate`).

## API

Todas as rotas em `/pedidos/**` exigem header `Authorization: Bearer <token>`, obtido no login.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra usuário (nome, email, senha) |
| POST | `/auth/login` | Autentica e retorna o JWT |
| POST | `/pedidos` | Cria um pedido (cliente, endereço, itens) |
| GET | `/pedidos` | Lista todos os pedidos |
| GET | `/pedidos/{id}` | Busca um pedido por ID |
| PATCH | `/pedidos/{id}/status` | Atualiza o status do pedido |

### Status do pedido

```
RECEBIDO → EM_PREPARO → SAIU_PARA_ENTREGA → ENTREGUE
   └──────────────┴───────────────┘
                CANCELADO (a partir de qualquer estado não-terminal)
```

Transições fora dessa ordem retornam `409 Conflict`.

## Configuração

Variável de ambiente opcional `JWT_SECRET` (chave de assinatura do token); se omitida, usa um valor default apenas para desenvolvimento local — defina uma própria antes de qualquer uso além de teste local.
