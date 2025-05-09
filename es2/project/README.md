# Pizza Express - Aplicação de Delivery de Pizza

Uma aplicação completa para gerenciamento de pedidos de pizza, com frontend em React/TypeScript e backend em Node.js/Express.

## Estrutura do Projeto

```
project/
├── frontend/          # Frontend React/TypeScript com Vite
└── backend/           # Backend Node.js/Express/TypeScript
```

## Requisitos

- Node.js 16+
- MySQL 8.0+

## Backend

### Configuração

1. Navegue até a pasta `backend`:
   ```
   cd backend
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` com suas credenciais de banco de dados:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=pizzeria
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   ```

4. Crie o banco de dados MySQL:
   ```sql
   CREATE DATABASE pizzeria;
   ```

5. Execute o script de seed para popular o banco de dados com dados iniciais:
   ```
   npm run seed
   ```

### Executando o Backend

```
npm run dev
```

O servidor será iniciado na porta 3000: http://localhost:3000

## Frontend

### Configuração

1. Navegue até a pasta raiz do projeto:
   ```
   cd ..
   ```

2. Instale as dependências:
   ```
   npm install
   ```

### Executando o Frontend

```
npm run dev
```

O aplicativo será iniciado no modo de desenvolvimento em: http://localhost:5173

## Funcionalidades

### Cliente
- Explorar cardápio de pizzas, bebidas e sobremesas
- Personalizar pizzas (tamanho, massa, borda, extras)
- Adicionar itens ao carrinho
- Gerenciar endereços de entrega
- Gerenciar métodos de pagamento
- Fazer pedidos
- Acompanhar status do pedido

### Administrador
- Gerenciar categorias e produtos
- Gerenciar opções de pizza
- Visualizar e atualizar status de pedidos

## Tecnologias Utilizadas

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Context API para gerenciamento de estado

### Backend
- Node.js
- Express
- TypeScript
- Sequelize (ORM)
- MySQL
- JWT para autenticação

## API Endpoints

### Autenticação
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Login de usuário

### Usuário
- `GET /api/users/profile` - Obter perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil do usuário

### Categorias
- `GET /api/categories` - Listar todas categorias
- `GET /api/categories/:id` - Obter detalhes de uma categoria

### Produtos
- `GET /api/products` - Listar todos produtos
- `GET /api/products/:id` - Obter detalhes de um produto
- `GET /api/products/category/:categoryId` - Listar produtos por categoria

### Opções de Pizza
- `GET /api/pizza-options` - Listar todas opções de personalização
- `GET /api/pizza-options/type/:type` - Listar opções por tipo

### Endereços
- `GET /api/addresses` - Listar endereços do usuário
- `POST /api/addresses` - Adicionar novo endereço
- `PUT /api/addresses/:id` - Atualizar endereço
- `DELETE /api/addresses/:id` - Remover endereço

### Métodos de Pagamento
- `GET /api/payment-methods` - Listar métodos de pagamento do usuário
- `POST /api/payment-methods` - Adicionar novo método de pagamento
- `PUT /api/payment-methods/:id` - Atualizar método de pagamento
- `DELETE /api/payment-methods/:id` - Remover método de pagamento

### Pedidos
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Obter detalhes de um pedido
- `POST /api/orders` - Criar novo pedido
- `PUT /api/orders/:id/status` - Atualizar status de um pedido
- `PUT /api/orders/:id/cancel` - Cancelar um pedido