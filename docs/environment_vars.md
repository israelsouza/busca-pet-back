# Tabela de Variáveis de Ambiente e SSM

Este documento descreve as variáveis de ambiente utilizadas pelo backend do Busca Pet, indicando a fonte de cada uma (se é um literal de ambiente ou se é lida via **AWS SSM Parameter Store** no deploy) e suas respectivas funções.

## Variáveis e Segredos

| Nome                        | Fonte                                                                   | Descrição                                                                      |
| --------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `STAGE`                     | env literal (serverless.yml)                                            | `dev`/`stg`/`prd` — controla qual conjunto de segredos ler do SSM              |
| `AWS_REGION`                | env literal                                                             | Região do deploy (default `us-east-1`)                                         |
| `LOG_LEVEL`                 | env literal                                                             | `debug`/`info`/`warn`/`error` (default `info`)                                 |
| `SUPABASE_URL`              | env literal                                                             | URL REST do projeto Supabase                                                   |
| `SUPABASE_ANON_KEY`         | env literal                                                             | Chave pública (anon role)                                                      |
| `SUPABASE_SERVICE_ROLE_KEY` | **SSM** (`/buscapet/<stage>/supabase/service-role-key`, `SecureString`) | Chave com bypass de RLS — só backend                                           |
| `DATABASE_URL`              | **SSM** (`/buscapet/<stage>/database/url`, `SecureString`)              | Connection string do Supabase Postgres via **transaction pooler** (porta 6543) |
| `DIRECT_DATABASE_URL`       | **SSM** (`/buscapet/<stage>/database/direct-url`, `SecureString`)       | Connection string do Supabase Postgres via **Direct Connection** (porta 5432)  |
| `JWT_SECRET`                | **SSM** (`/buscapet/<stage>/auth/jwt-secret`, `SecureString`)           | Segredo de assinatura JWT                                                      |

> **Sintaxe de Resolução no `serverless.yml`:** As variáveis sensíveis usam a sintaxe `${ssm:/buscapet/${self:provider.stage}/VAR, env:VAR}`. Isso garante que, em deploys remotos para a AWS, o SSM Parameter Store seja autoritativo (evitando a contaminação por variáveis de ambiente locais do shell), com fallback para o `.env` local durante execuções offline.
