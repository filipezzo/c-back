# Plataforma C – Backend - projeto de extensão infnet.

Backend da plataforma gamificada para aprender C, usando **Fastify**, **Prisma** e **PostgreSQL**.

[Notion com o registro de horas](https://www.notion.so/Projeto-de-Extens-o-243ebc98b92c803da72afe760a3589d2?source=copy_link)

## Requisitos
- Node.js 24.5.0
- npm
- Docker + Docker Compose

## Instalação e uso

```bash
git clone https://github.com/filipezzo/c-back.git
cd plataforma-c-backend

# Criar .env
echo 'DATABASE_URL="postgresql://root:root@localhost:5432/db?schema=public" > .env

# Instalar dependências
npm i

# Subir banco e app
docker compose up -d

# Gerar cliente e criar tabelas
pnpm prisma generate
pnpm prisma migrate dev --name init

# Rodar em dev
pnpm dev
