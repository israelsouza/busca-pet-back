## Projeto - Busca Pet

O projeto iniciou no segundo semestre da faculdade mas que eu gostaria de continuar desenvolvendo, tentando novas tecnologias e até deployando em alguma plataforma.

### Descrição

O Busca Pet é uma aplicação web desenvolvida para ajudar na localização de animais de estimação perdidos. A plataforma permite que usuários registrem informações sobre seus pets desaparecidos, incluindo fotos, descrições e locais onde foram vistos pela última vez. Outros usuários podem visualizar esses registros e ajudar na busca compartilhando informações ou reportando avistamentos.

### Áreas do Projeto

- **Frontend**: Desenvolvido com Next.js
- **Backend**: Construído com Node.js, TypeScript e Express
- **Banco de Dados**: Utiliza PostgreSQL containerizado com Docker, gerenciado através do Sequelize ORM
- **Autenticação**: Implementada com JWT (JSON Web Tokens)
- **Hospedagem**: Planejado para deploy nas plataformas: Vercel (frontend) e Railway (backend)

### Estrategia de branching (Git)

- `main`: Branch principal contendo o código estável e pronto para produção.
- `develop`: Branch de desenvolvimento onde novas funcionalidades são integradas antes de serem mescladas na `main`.
- `feature/nome-da-feature`: Branches para desenvolvimento de novas funcionalidades específicas.
- `hotfix/nome-do-hotfix`: Branches para correções rápidas de bugs na branch `main`.
- `release/nome-da-release`: Branches para preparar uma nova versão para produção, incluindo testes e ajustes finais.

### Tecnologias Utilizadas

- **Linguagens**: TypeScript
- **Frameworks e Bibliotecas**: Express
- **Gerenciamento de Pacotes**: pnpm

### Instalação

1. Clone o repositório:
2. Utilize a mesma versão do Node.js especificada no arquivo `.nvmrc` com o comando:

   ```
   nvm use

   # caso não tenha a versão instalada, utilize:

   nvm install
   ```

3. Instale as dependências do projeto

   ```
   pnpm install
   ```

### Estrutura de arquivos e pastas

```
busca-pet-back/
├── src/
|   ├── server.ts       # Inicia o servidor Express
|   ├── app.ts          # Configuração principal da aplicação Express
|── .gitignore
|── notes.md            # Notas, informações adicionais e ideias para o projeto
├── package.json        # Dependências e scripts do Node.js
├── pnpm-lock.json      # Versões exatas das dependências
|── README.md           # Documentação do projeto
├── tsconfig.json       # Configuração do TypeScript

```
