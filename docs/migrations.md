# Guia de Migrações com Prisma e Supabase

Este documento descreve o processo de criação e aplicação de migrações de banco de dados (schema Postgres) utilizando **Prisma** e **Supabase** no desenvolvimento local e no ambiente remoto hospedado.

---

## 1. Fluxo de Trabalho (Workflow)

O fluxo de desenvolvimento é dividido em duas etapas: criar a migração no ambiente local e aplicá-la no banco de dados na nuvem.

### Etapa A: Criar e Testar a Migração Localmente

1. Edite os modelos de dados no arquivo `prisma/schema.prisma`.
2. Execute o comando de migração local (apontando para o seu banco Docker/Supabase CLI local):
   ```bash
   pnpm prisma migrate dev --name <nome_da_alteracao>
   ```
   _Exemplo:_
   ```bash
   pnpm prisma migrate dev --name cria_tabela_pets
   ```
3. O Prisma gerará automaticamente os arquivos de migração SQL dentro da pasta `prisma/migrations/` e aplicará as alterações no banco de dados local.

---

### Etapa B: Aplicar as Migrações no Supabase Hospedado (Nuvem)

Para aplicar as migrações salvas na pasta `prisma/migrations/` no banco de dados remoto do Supabase (Dev, Staging ou Prod):

1. Obtenha a URL de conexão do seu projeto Supabase na nuvem (preferencialmente via **Transaction Pooler** na porta `6543`).
2. Execute o comando `prisma migrate deploy` injetando temporariamente a URL do banco remoto:

   ```bash
   DATABASE_URL="postgresql://postgres.xxxx:senha@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" pnpm prisma migrate deploy
   ```

> **Dica Linux/Bash:** Injetar `DATABASE_URL="..."` antes do comando aplica a variável **apenas para essa execução específica**, mantendo o seu arquivo `.env` local intacto.

---

## 2. Tipos de Conexão no Supabase (Porta 5432 vs 6543)

| Porta    | Nome                               | Aplicação                                                                                                                      |
| :------- | :--------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| **5432** | **Direct Connection**              | Conexão direta com o PostgreSQL. Usada para alterações diretas de banco.                                                       |
| **6543** | **Transaction Pooler (PgBouncer)** | **Recomendado para AWS Lambda.** Gerencia conexões concorrentes em picos de tráfego, evitando estouro de conexões do Postgres. |
