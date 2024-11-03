# Halleluyah API

Uma API Node.js construída com Express, TypeScript e Prisma.

## Pré-requisitos

- Node.js (v20 ou superior)
- Banco de dados PostgreSQL
- npm

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/yourusername/halleluyah-api.git
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` no diretório raiz com as seguintes variáveis:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/halleluyah?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/halleluyah?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"
HASHID_SALT="your-hashid-salt"
HASHID_MIN_LENGTH="6"
PORT="4000"
```

4. Execute as migrações do banco de dados:
```bash
npm run migrate
```

5. Popule o banco de dados com dados iniciais:
```bash
npm run seed
```

## Executando a Aplicação

Modo de desenvolvimento com hot reload:
```bash
npm run dev
```

Build de produção:
```bash
npm run build
npm start
```

## Acesso Padrão do Administrador

Após popular o banco de dados, você pode acessar o sistema com:
- Email: admin@admin.com
- Password: Admin@123

## Environment Variables

- `DATABASE_URL`: String de conexão com o banco de dados PostgreSQL
- `DIRECT_URL`: URL de conexão direta com o banco de dados
- `JWT_SECRET`: Chave secreta para geração de tokens JWT
- `JWT_REFRESH_SECRET`: Chave secreta para tokens de atualização
- `HASHID_SALT`: Salt para geração de IDs hash
- `HASHID_MIN_LENGTH`: Tamanho mínimo para IDs hash gerados
- `PORT`: Porta do servidor da API (padrão é 4000)
- `NODE_ENV`: Ambiente da aplicação (development/production/test)
