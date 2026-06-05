# Projeto - Busca Pet

O buscapet surgiu de um projeto acadêmico, o intuito de refazer esse projeto do zero é puramente experimantal, visando aprimorar minhas habilidades em desenvolvimento web e explorar novas tecnologias e práticas de desenvolvimento.


### Descrição

O Busca Pet é uma aplicação web desenvolvida para ajudar na localização de animais de estimação perdidos. A plataforma permite que usuários registrem informações sobre seus pets desaparecidos, incluindo fotos, descrições e locais onde foram vistos pela última vez. Outros usuários podem visualizar esses registros e ajudar na busca compartilhando informações ou reportando avistamentos.


### Áreas do Projeto

| Área        | Antes    | Agora                            |
| ---------------------- | -------- | -------------------------------- |
| Frontend ([nesse repositório](https://github.com/israelsouza/busca-pet-front))            | React | Next.js                     |
| Backend    | Node.js      | NestJS |
| Banco de Dados | Oracle      | PostgreSQL                             |
| Autenticação | JWT     | ???                             |
| Hospedagem | N/A - N/A     | Vercel - ???                             |


### Tecnologias Utilizadas

| Tecnologia/Área        | Antes    | Agora                            |
| ---------------------- | -------- | -------------------------------- |
| Gerenciamento de Pacotes | npm | pnpm                     |
| Qualidade de Código    | N/A      | ESLint + Prettier + editorconfig |


### Estrategia de branching (Git)

- `main`: Branch principal contendo o código estável e pronto para produção.
- `feature/nome-da-feature`: Branches para desenvolvimento de novas funcionalidades específicas.
- `hotfix/nome-do-hotfix`: Branches para correções rápidas de bugs na branch `main`.


### Instalação

1. Clone o repositório:
2. Utilize a mesma versão do Node.js especificada no arquivo `.nvmrc` com o comando:

   ```bash
   nvm use

   # caso não tenha a versão instalada, utilize:
   nvm install
   ```

3. Instale as dependências do projeto

   ```bash
   pnpm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   pnpm run start:dev
   ```


### Estrutura de arquivos e pastas

```text
busca-pet-back/
├── src/
|   ├── main.ts             # Ponto de entrada da aplicação NestJS
|   ├── app.module.ts       # Módulo principal da aplicação
|   ├── app.controller.ts    # Controlador principal
|   └── app.service.ts       # Serviço principal
├── test/                   # Testes automatizados (e2e)
├── .editorconfig       # Configuração do EditorConfig
├── .gitignore
├── .nvmrc                  # Versão do Node.js utilizada
├── .prettierignore     # Arquivos e pastas ignorados pelo Prettier
├── .prettierrc         # Configuração do Prettier
├── eslint.config.mjs       # Configuração do ESLint
├── nest-cli.json           # Configuração do NestJS CLI
├── package.json            # Dependências e scripts do Node.js
├── pnpm-lock.yaml          # Versões exatas das dependências
├── README.md               # Documentação do projeto
├── tsconfig.build.json     # Configuração do TypeScript para build
└── tsconfig.json           # Configuração do TypeScript

```


### Observações

- Devido à hospedagem gratuita limitada, o backend pode demorar alguns instantes para "acordar" após um período de inatividade.
- O projeto está em constante evolução, e novas funcionalidades podem ser adicionadas no futuro.
- Feedbacks e contribuições são bem-vindos!
