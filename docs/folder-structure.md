# Estrutura de Pastas Planejada

## Visão Geral

src/
├── server.ts              ← 🎬 Entry Point (não é classe)
├── app.ts                 ← 🏗️ Classe App (orquestra Express)
├── modules/
│   └── Users/
│   └── Pets/
│   └── Posts/
│   └── Notifications/
│   └── Admin/
│
├── utils/
│
├── middlewares/
│   ├── auth.middleware.ts       (JWT)
│   └── schemas/
│       
└── infra/
    └── compose.yaml      ← 📦 Docker para subir o banco de dados
    └── database.ts       ← 🗄️ Configuração do Banco de Dados
        └── migrations/

## 📦 Camada de Módulos (Feature-based)

Cada módulo segue a estrutura:

- **Routes**: Define endpoints HTTP
- **Controller**: Lida com Request/Response
- **Model**: Lógica de negócio + persistência no banco
- **Middlewares**: Validações específicas do módulo

## 🛡️ Middlewares Globais

Middlewares compartilhados entre módulos:
- Autenticação (JWT)

## 🔧 Utils

Funções auxiliares reutilizáveis:
- Wrapper para async/await
- Logger configurado
