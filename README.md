# Mini Rastreador de Pedidos

Sistema simplificado de rastreamento de pedidos de delivery: autenticação, criação de pedidos e acompanhamento de status.

## Stack

- **Backend:** Java 21, Spring Boot 3, Spring Security, Spring Data JPA, SQLite, JWT, BCrypt
- **Frontend:** React, Vite, React Router, Axios, Context API, Tailwind CSS

## Estrutura

- `backend/` — API REST (controller/service/repository/entity/dto/mapper/security/exception)
- `frontend/` — aplicação React (pages/components/context/services)

## Pré-requisitos

- **JDK 21** instalado e no PATH (`java -version` deve mostrar 21.x). O projeto usa o Maven Wrapper, então **não precisa ter o Maven instalado** — mas o wrapper ainda precisa de um JDK para rodar.
- **Node.js 20+** (recomendado 22 LTS) e npm.
- Conexão com a internet na primeira execução: o `mvnw` baixa o Maven na primeira vez, o Maven baixa as dependências do backend, e o `npm install` baixa os pacotes do frontend. A funcionalidade de autocompletar endereço pelo CEP também depende de internet (consulta a API pública ViaCEP em tempo de uso).

## Como rodar

### 1. Backend (porta 8080)

```bash
cd backend
./mvnw spring-boot:run
```

No Windows, se não estiver usando Git Bash/WSL, use `mvnw.cmd spring-boot:run` (ou `mvnw` direto no CMD/PowerShell).

O banco SQLite (`pedidos.db`) é criado automaticamente na primeira execução, na própria pasta `backend/`. Aguarde a mensagem `Started RastreadorPedidosApplication` antes de abrir o frontend.

### 2. Frontend (porta 5173)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O backend precisa estar rodando em `http://localhost:8080` (CORS já liberado para essa origem).

Não há usuário nem dados de exemplo pré-cadastrados — use a tela **Cadastre-se** para criar uma conta antes de logar.

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
| GET | `/pedidos?page=0&size=10` | Lista pedidos paginados (ordenado por ID decrescente) |
| GET | `/pedidos/{id}` | Busca um pedido por ID |
| PATCH | `/pedidos/{id}/status` | Atualiza o status do pedido |

`GET /pedidos` aceita `page` (padrão `0`) e `size` (padrão `10`) como query params e retorna:

```json
{
  "content": [ /* pedidos da página atual */ ],
  "page": 0,
  "size": 10,
  "totalElements": 23,
  "totalPages": 3
}
```

### Status do pedido

```
RECEBIDO → EM_PREPARO → SAIU_PARA_ENTREGA → ENTREGUE
   └──────────────┴───────────────┘
                CANCELADO (a partir de qualquer estado não-terminal)
```

Transições fora dessa ordem retornam `409 Conflict`.

## Configuração

Variável de ambiente opcional `JWT_SECRET` (chave de assinatura do token); se omitida, usa um valor default apenas para desenvolvimento local — defina uma própria antes de qualquer uso além de teste local.
