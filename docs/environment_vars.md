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
| `JWT_SECRET`                | **SSM** (`/buscapet/<stage>/auth/jwt-secret`, `SecureString`)           | Segredo de assinatura JWT                                                      |

> **Sintaxe de Fallback no `serverless.yml`:** As variáveis sensíveis usam o formato `${env:VAR, ssm:/buscapet/${self:provider.stage}/VAR}`. Isso garante que no desenvolvimento local o valor seja lido diretamente do arquivo `.env` (sem necessidade de consultar a AWS), enquanto no deploy para a AWS o valor é injetado automaticamente a partir do SSM Parameter Store do stage correspondente.
