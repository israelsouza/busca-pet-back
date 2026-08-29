# Guia de Contribuição — Busca Pet (Backend)

Primeiramente, muito obrigado por considerar contribuir com o **Busca Pet**! 🐾

Este guia fornece as orientações para configurar o ambiente de desenvolvimento, criar novas funcionalidades, corrigir bugs e submeter suas contribuições de forma clara e padronizada.

---

## 🚀 Pré-Requisitos

Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas na sua máquina:

- **Node.js**: Versão especificada no `.nvmrc` (v24.x).
- **pnpm**: Gerenciador de pacotes padrão (`pnpm@11.x`).
- **Docker & Docker Compose**: Necessário para rodar o ambiente Supabase/PostgreSQL local.
- **Git**: Controle de versão.

---

## 🛠️ Configuração do Ambiente Local

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/israelsouza/busca-pet-back.git
   cd busca-pet-back
   ```

2. **Configure a versão correta do Node.js:**

   ```bash
   nvm use
   ```

3. **Instale as dependências:**

   ```bash
   pnpm install
   ```

4. **Configure as Variáveis de Ambiente:**
   Copie o arquivo de exemplo `.env.example` para `.env`:

   ```bash
   cp .env.example .env
   ```

5. **Inicie a infraestrutura local (Supabase & PostgreSQL via Docker):**

   ```bash
   pnpm supabase start
   ```
   O painel estará acessível em `http://127.0.0.1:54323`

6. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm run start:dev
   ```
   A API estará acessível em `http://localhost:3000/api`.

---

## 🌿 Padrão de Branches

Para manter a organização do repositório, utilize a seguinte convenção de nomes de branch:

- `feature/nome-da-funcionalidade`: Para novas funcionalidades.
- `fix/nome-da-correcao` ou `hotfix/nome-do-bug`: Para correções de bugs.
- `docs/nome-da-atualizacao`: Para melhorias na documentação.

> **Importante:** Sempre crie sua branch a partir da `main` atualizada e envie seus Pull Requests direcionados à branch `main`.

---

## 📝 Padrão de Commits (Conventional Commits)

Este projeto utiliza o padrão [Conventional Commits](https://www.conventionalcommits.org/) para manter o histórico claro e automatizado.

### Prefixos Aceitos:

- `feat:` Nova funcionalidade para o usuário.
- `fix:` Correção de um bug.
- `docs:` Alterações apenas na documentação.
- `style:` Formatação de código sem alterar regra de negócio (espaço, vírgulas, etc.).
- `refactor:` Refatoração de código que não altera comportamento público.
- `test:` Adição ou correção de testes automatizados.
- `chore:` Atualizações de build, dependências ou ferramentas de suporte.

### Helper de Commit:

Para facilitar a criação de commits padronizados, você pode rodar:

```bash
pnpm run commit
```

Esse comando executará a verificação do Prettier e abrirá uma interface interativa (Commitizen) para formatar sua mensagem de commit.

---

## ✅ Verificações Obrigatórias Antes de Enviar o PR

Antes de abrir um Pull Request, garanta que todos os testes e verificações de qualidade estejam passando localmente:

```bash
# 1. Verificar formatação do código
pnpm run prettier:check

# 2. Verificar regras de Linting
pnpm run eslint:check

# 3. Executar os testes unitários
pnpm run test

# 4. Garantir que a compilação do TypeScript está sem erros
pnpm run build
```

---

## 📬 Como Submeter um Pull Request (PR)

1. Faça o `push` da sua branch para o seu repositório ou fork:
   ```bash
   git push origin feature/sua-funcionalidade
   ```
2. Abra o Pull Request no GitHub descrevendo:
   - **O que foi feito:** Um resumo objetivo da mudança.
   - **Motivação:** Por que essa alteração é necessária.
   - **Como testar:** Passos para validar a funcionalidade localmente.
3. Aguarde os testes automatizados do GitHub Actions passarem e a revisão de código.

---

## 🤝 Código de Conduta

Seja respeitoso, inclusivo e colaborativo em comentários de PRs, Issues e discussões.

Agradecemos imensamente a sua contribuição! 🐶🐱
