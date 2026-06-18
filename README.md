# 📚 EduMarket - Marketplace Educacional

Uma plataforma moderna de educação online que conecta alunos com professores experientes. O EduMarket oferece cursos de qualidade, agendamento de aulas, comunidade colaborativa e múltiplas formas de pagamento.

---

## 👥 Equipe — Grupo 10

| Integrante | RA | Responsabilidade |
|---|---|---|
| **Victor Rodrigo Castro Silva** | UC24200210 | Arquitetura do backend, API REST (Express + Drizzle ORM), integração com banco de dados SQLite e autenticação Google OAuth |
| **João Vitor Lima de Queiroz** | UC24202203 | Desenvolvimento do frontend (React + TypeScript), páginas de cursos, player YouTube e fluxo de Meus Cursos |
| **Lucas Gomes Borges** | UC25200817 | Sistema de pagamento (Stripe), carrinho de compras, página de anúncios e notificações |
| **Maikon Douglas Pereira da Silva** | UC26103672 | Telas de cadastro e login, navegação, internacionalização (i18n), temas dark/light e comunidade |

---

## 🎯 Funcionalidades Principais

### 1. **Tela de Cadastro** 📝
Registro de novos usuários com suporte para dois tipos de conta:

- **Aluno**: Acesso a cursos, agendamento de aulas e comunidade
- **Professor**: Publicação de cursos, gerenciamento de aulas e interação com alunos

**Localização:** `/register`

**Campos do Formulário:**
- Nome completo
- Email
- Senha (com validação)
- Confirmação de senha
- Tipo de conta (Aluno/Professor)

---

### 2. **Tela de Pagamento** 💳
Sistema seguro de pagamento integrado com Stripe.

**Localização:** `/payment`

**Métodos disponíveis:**
- Cartão de crédito (processado via Stripe)
- Cupons de desconto

**Cupons disponíveis:**

| Cupom | Desconto |
|-------|----------|
| `JAUM` | 100% |
| `EDUMARKET10` | 10% |
| `BEMVINDO20` | 20% |

**Cartão de teste Stripe:**
```
Número:   4242 4242 4242 4242
Validade: qualquer data futura
CVC:      qualquer 3 dígitos
```

---

### 3. **Perfil do Professor & Agendamento** 👨‍🏫
Página dedicada ao perfil do professor com funcionalidade de agendamento de aulas.

**Localização:** `/teacher/:id`

**Recursos:**
- Informações do professor (avaliação, alunos, valor/hora)
- Modal interativo para agendamento
- Histórico de aulas agendadas
- Avaliações de alunos

---

### 4. **Comunidade** 💬
Espaço colaborativo para alunos compartilharem conhecimento.

**Localização:** `/community`

**Recursos:**
- Criar e curtir posts
- Busca por palavras-chave
- Comentários

---

### 5. **Cursos com Player YouTube** 📖
Acesso aos cursos com vídeos embedados diretamente do YouTube.

**Localização:** `/courses` e `/meus-cursos`

**Recursos:**
- Thumbnails reais do YouTube
- Player iframe integrado
- Sidebar com lista de aulas
- Progresso por módulo

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- npm

### Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Criar tabelas e popular o banco de dados
node migrate.mjs

# 3. Iniciar o projeto
npm run dev
```

O frontend estará em **http://localhost:3000** e o backend em **http://localhost:3333**.

### Comandos disponíveis

```bash
npm run dev      # Inicia frontend + backend simultaneamente
npm run build    # Compila para produção
npm run start    # Inicia em modo produção
npm run check    # Verifica tipos TypeScript
```

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Roteamento** | Wouter |
| **Estilização** | Tailwind CSS 4 |
| **Componentes** | shadcn/ui |
| **Ícones** | Lucide React |
| **Notificações** | Sonner |
| **Build** | Vite |
| **Backend** | Node.js + Express |
| **ORM** | Drizzle ORM |
| **Banco de Dados** | SQLite (libsql) |
| **Pagamento** | Stripe |
| **Auth** | Google OAuth 2.0 (Passport.js) |
| **Vídeos** | YouTube Embed (iframe) |

### Estrutura de Pastas

```
edumarket_v2/
├── client/
│   └── src/
│       ├── pages/             # Páginas da aplicação
│       ├── components/        # Componentes reutilizáveis
│       ├── contexts/          # React Contexts (Theme, Lang)
│       ├── lib/               # i18n, utilitários
│       ├── App.tsx
│       └── main.tsx
├── server/
│   ├── index.ts               # API Express
│   ├── schema.ts              # Schema Drizzle ORM
│   └── db/
├── migrate.mjs                # Script de criação do banco
├── vite.config.ts
└── package.json
```

---

## 🌍 Internacionalização

A plataforma suporta 4 idiomas, configuráveis em Configurações:

| Idioma | Código |
|--------|--------|
| 🇧🇷 Português | `pt` |
| 🇺🇸 English | `en` |
| 🇪🇸 Español | `es` |
| 🇷🇺 Русский | `ru` |

---

## 🎨 Design

### Paleta de Cores

| Cor | Uso |
|-----|-----|
| Roxo `#9333ea` | Botões, destaques, links |
| Azul `#3b82f6` | Gradientes, backgrounds |
| Verde `#10b981` | Status positivo |
| Vermelho `#ef4444` | Status negativo, erros |

### Temas
- ☀️ Modo claro (padrão)
- 🌙 Modo escuro (configurável)

---

## 🐛 Troubleshooting

**`pnpm: command not found`** → Use `npm install` no lugar de `pnpm install`.

**`Cannot find package '@libsql/client'`** → Rode `npm install` antes do `node migrate.mjs`.

**`concurrently não é reconhecido`** → Rode `npm install` para instalar todas as dependências locais.

**Vídeos não aparecem em `/courses`** → Certifique-se de ter rodado `node migrate.mjs` após o `npm install`.

**Anúncios não aparecem** → Verifique se o servidor backend está rodando na porta 3333.

---

## 📄 Licença

Este projeto está licenciado sob a MIT License.

---

**Versão:** 1.0.0 | **Grupo:** 10 | **Disciplina:** Novas Tecnologias | **UCB**
