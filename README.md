# Projeto - Busca Pet

O buscapet surgiu de um projeto acadêmico, o intuito de refazer esse projeto do zero é puramente experimantal, visando aprimorar minhas habilidades em desenvolvimento web e explorar novas tecnologias e práticas de desenvolvimento.

### Descrição

O Busca Pet é uma aplicação web desenvolvida para ajudar na localização de animais de estimação perdidos. A plataforma permite que usuários registrem informações sobre seus pets desaparecidos, incluindo fotos, descrições e locais onde foram vistos pela última vez. Outros usuários podem visualizar esses registros e ajudar na busca compartilhando informações ou reportando avistamentos.

### Áreas do Projeto

| Área                                                                           | Antes     | Agora                               |
| ------------------------------------------------------------------------------ | --------- | ----------------------------------- |
| Frontend ([nesse repositório](https://github.com/israelsouza/busca-pet-front)) | React     | Next.js                             |
| Backend                                                                        | Node.js   | NestJS                              |
| Banco de Dados                                                                 | Oracle    | PostgreSQL (supabase)               |
| Hospedagem                                                                     | N/A - N/A | Vercel - (AWS Lambda + API Gateway) |

### Tecnologias Utilizadas

| Tecnologia/Área          | Antes | Agora                             |
| ------------------------ | ----- | --------------------------------- |
| Gerenciamento de Pacotes | npm   | pnpm                              |
| Qualidade de Código      | N/A   | ESLint + Prettier + editorconfig  |
| ORM                      | N/A   | Prisma 5                          |
| Validação em runtime     | N/A   | Zod + nestjs-zod                  |
| Build                    | N/A   | Serverless Framework v4 + esbuild |

### Estrategia de branching (Git)

- `main`: Branch principal contendo o código estável e pronto para produção.
- `feature/nome-da-feature`: Branches para desenvolvimento de novas funcionalidades específicas.
- `hotfix/nome-do-hotfix`: Branches para correções rápidas de bugs na branch `main`.

### Estrutura de arquivos e pastas

Para configurar o ambiente local, consulte o [Guia de Contribuição](CONTRIBUTING.md).

```text
busca-pet-back/
├── docs/                   # Documentação detalhada do projeto
│   ├── environment_vars.md # Tabela de variáveis de ambiente e segredos SSM
│   └── migrations.md       # Guia de migrações com Prisma e Supabase
├── prisma/                 # Modelagem e migrações do banco de dados
│   └── schema.prisma       # Schema do PostgreSQL
├── src/                    # Código fonte da aplicação NestJS
│   ├── app/                # Setup de bootstrap (local e Lambda)
│   ├── hello-world/        # Módulo de exemplo/health check
│   ├── app.module.ts       # Módulo raiz do NestJS
│   ├── lambda.ts           # Entrypoint da função AWS Lambda (Serverless)
│   └── main.ts             # Entrypoint para desenvolvimento local
├── supabase/               # Configurações do Supabase CLI local
│   └── config.toml
├── test/                   # Testes automatizados (e2e e unidade)
├── .editorconfig           # Configurações de formatação do editor
├── .env.example            # Exemplo de variáveis de ambiente
├── .gitignore              # Arquivos e pastas ignorados pelo Git
├── .nvmrc                  # Versão do Node.js (v24)
├── .prettierignore         # Arquivos ignorados pelo Prettier
├── .prettierrc             # Configurações de formatação do Prettier
├── commitlint.config.js    # Configurações do Commitlint (Conventional Commits)
├── CONTRIBUTING.md         # Guia de contribuição Open Source
├── eslint.config.mjs       # Configurações de linting (ESLint v9)
├── LICENSE                 # Licença do projeto (MIT)
├── nest-cli.json           # Configurações do NestJS CLI
├── package.json            # Scripts e dependências do projeto
├── pnpm-lock.yaml          # Lockfile de dependências exatas (pnpm)
├── pnpm-workspace.yaml     # Configurações de workspace do pnpm
├── README.md               # Documentação principal do repositório
├── serverless.yml          # Configurações de infraestrutura Serverless (AWS Lambda)
├── tsconfig.build.json     # Configuração TypeScript para build de produção
└── tsconfig.json           # Configuração base do TypeScript
```

### Observações

- Devido à hospedagem gratuita limitada, o backend pode demorar alguns instantes para "acordar" após um período de inatividade.
- O projeto está em constante evolução, e novas funcionalidades podem ser adicionadas no futuro.
- Feedbacks e contribuições são bem-vindos!
