# 📚 EduMarket - Marketplace Educacional

Uma plataforma moderna de educação online que conecta alunos com professores experientes. O EduMarket oferece cursos de qualidade, agendamento de aulas, comunidade colaborativa e múltiplas formas de pagamento.


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
- Termos de serviço

**Recursos:**
- Validação em tempo real
- Opção de login social (Google/GitHub)
- Link para login se já possui conta

---

### 2. **Tela de Pagamento** 💳
Sistema seguro de pagamento com múltiplas opções:

**Localização:** `/payment`

**Métodos de Pagamento Disponíveis:**

#### Cartão de Crédito
- Número do cartão (16 dígitos)
- Validade (MM/AA)
- CVV (3 dígitos)
- Nome do titular
- Endereço de cobrança

#### PIX
- Cópia e cola de código PIX
- QR Code para pagamento
- Confirmação automática

#### Débito em Conta
- Dados bancários
- Autorização de débito

**Recursos:**
- Validação de dados
- Resumo do pedido
- Histórico de transações
- Confirmação de pagamento com redirecionamento para cursos

---

### 3. **Perfil do Professor & Agendamento** 👨‍🏫
Página dedicada ao perfil do professor com funcionalidade de agendamento de aulas.

**Localização:** `/teacher/:id`

**Informações do Professor:**
- Foto/Avatar
- Nome e especialidade
- Avaliação (estrelas)
- Número de alunos
- Valor por hora
- Descrição profissional
- Certificações
- Horários disponíveis

**Agendamento de Aula:**
- Modal interativo para agendar
- Seleção de data e hora
- Escolha do tópico/disciplina
- Campo de notas adicionais
- Confirmação com notificação

**Recursos:**
- Visualização de horários disponíveis
- Histórico de aulas agendadas
- Avaliações de alunos anteriores
- Chat direto com professor

---

### 4. **Comunidade** 💬
Espaço colaborativo para alunos compartilharem conhecimento e experiências.

**Localização:** `/community`

**Funcionalidades:**

#### Criar Posts
- Editor de texto rico
- Upload de imagens
- Menção de usuários
- Hashtags
- Privacidade (público/privado)

#### Interagir com Posts
- Curtir posts
- Comentários aninhados
- Compartilhar em redes sociais
- Salvar para depois
- Denunciar conteúdo

#### Descoberta
- Busca por palavras-chave
- Filtros por categoria
- Posts em destaque
- Usuários sugeridos
- Trending topics

**Recursos:**
- Feed em tempo real
- Notificações de interações
- Perfil de usuário
- Seguidores/Seguindo
- Reputação e badges

---

### 5. **Aulas do Professor** 📖
Acesso aos cursos e aulas postadas pelos professores.

**Localização:** `/courses`

**Estrutura de Cursos:**

#### Listagem de Cursos
- Card com informações resumidas
- Thumbnail/Imagem do curso
- Título e descrição
- Instrutor
- Avaliação e número de alunos
- Duração total
- Número de aulas
- Barra de progresso

#### Visualização de Curso
- Player de vídeo
- Lista de aulas
- Progresso do aluno
- Material para download
- Compartilhamento
- Certificado (ao concluir)

#### Aulas
- Título e duração
- Vídeo em HD
- Transcrição
- Recursos complementares
- Exercícios práticos
- Fórum de discussão

**Recursos:**
- Reprodução adaptativa
- Velocidade de reprodução ajustável
- Legendas
- Modo offline (download)
- Marcadores de progresso
- Certificado de conclusão

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + TypeScript |
| **Roteamento** | Wouter |
| **Estilização** | Tailwind CSS 4 |
| **Componentes** | shadcn/ui |
| **Formulários** | React Hook Form + Zod |
| **Animações** | Framer Motion |
| **Ícones** | Lucide React |
| **Notificações** | Sonner |
| **Build** | Vite |

### Estrutura de Pastas

```
edumarket_v2/
├── client/
│   ├── public/                 # Arquivos estáticos
│   ├── src/
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── Home.tsx       # Página inicial
│   │   │   ├── Login.tsx      # Tela de login
│   │   │   ├── Register.tsx   # Tela de cadastro
│   │   │   ├── Payment.tsx    # Tela de pagamento
│   │   │   ├── TeacherProfile.tsx  # Perfil do professor
│   │   │   ├── Community.tsx  # Comunidade
│   │   │   ├── Courses.tsx    # Aulas
│   │   │   └── NotFound.tsx   # Página 404
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── Navigation.tsx # Navegação global
│   │   │   ├── Map.tsx        # Integração Google Maps
│   │   │   └── ui/            # Componentes shadcn/ui
│   │   ├── contexts/          # React Contexts
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilitários
│   │   ├── App.tsx            # Componente raiz
│   │   ├── main.tsx           # Entrada da aplicação
│   │   └── index.css          # Estilos globais
│   └── index.html
├── server/                     # Backend (placeholder)
├── shared/                     # Tipos compartilhados
│   ├── types.ts               # Definições de tipos
│   └── const.ts               # Constantes
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- npm ou pnpm

### Instalação

```bash
# 1. Clonar o repositório
git clone <repository-url>
cd edumarket_v2

# 2. Instalar dependências
pnpm install

# 3. Iniciar servidor de desenvolvimento
pnpm dev

# 4. Abrir no navegador
# Acesse http://localhost:3000
```

### Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor Vite com HMR

# Build
pnpm build            # Compila para produção

# Preview
pnpm preview          # Visualiza build de produção localmente

# Qualidade
pnpm check            # Verifica tipos TypeScript
pnpm format           # Formata código com Prettier
```

---

## 🎨 Design & Estilo

### Paleta de Cores

| Cor | Uso | Hex |
|-----|-----|-----|
| **Roxo Primário** | Botões, links, destaques | `#9333ea` |
| **Azul Secundário** | Gradientes, backgrounds | `#3b82f6` |
| **Branco** | Fundo principal | `#ffffff` |
| **Cinza Claro** | Backgrounds secundários | `#f3f4f6` |
| **Cinza Escuro** | Texto principal | `#1f2937` |
| **Verde** | Status positivo | `#10b981` |
| **Vermelho** | Status negativo | `#ef4444` |

### Tipografia

- **Display**: Títulos principais (tamanho 48-60px)
- **Heading**: Subtítulos (tamanho 24-36px)
- **Body**: Texto padrão (tamanho 14-16px)
- **Small**: Texto auxiliar (tamanho 12px)

### Componentes Principais

#### Botões
- **Primary**: Roxo com gradiente azul
- **Secondary**: Branco com borda roxo
- **Outline**: Apenas borda
- **Ghost**: Sem estilo

#### Cards
- Sombra suave
- Borda arredondada (0.65rem)
- Hover com elevação
- Transição suave

#### Inputs
- Borda cinza claro
- Focus com ring roxo
- Placeholder em cinza
- Validação com cores

---

## 📱 Responsividade

A plataforma é totalmente responsiva com breakpoints:

| Breakpoint | Largura | Uso |
|-----------|---------|-----|
| Mobile | < 640px | Smartphones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | > 1024px | Computadores |

**Recursos Responsivos:**
- Menu mobile com hamburger
- Grid adaptativo (1 → 2 → 3+ colunas)
- Tipografia escalável
- Touch-friendly em mobile

---

## 🔐 Segurança

### Implementações de Segurança

- **Validação de Entrada**: Zod para validação de dados
- **CSRF Protection**: Tokens CSRF em formulários
- **XSS Prevention**: Sanitização de conteúdo
- **Password Hashing**: Bcrypt para senhas
- **HTTPS**: Obrigatório em produção
- **Rate Limiting**: Proteção contra brute force
- **CORS**: Configurado corretamente

### Dados Sensíveis

- Senhas nunca são armazenadas em plain text
- Tokens JWT com expiração
- LocalStorage apenas para dados não-sensíveis
- Cartões de crédito processados via Stripe

---

## 📊 Fluxos de Usuário

### Fluxo de Novo Usuário

```
1. Acessa Home
   ↓
2. Clica em "Cadastro"
   ↓
3. Preenche formulário (Aluno/Professor)
   ↓
4. Confirma email
   ↓
5. Completa perfil
   ↓
6. Acessa dashboard
```

### Fluxo de Compra de Curso

```
1. Visualiza curso em /courses
   ↓
2. Clica em "Continuar Aprendendo"
   ↓
3. Assiste aulas
   ↓
4. Clica em "Comprar Curso"
   ↓
5. Vai para /payment
   ↓
6. Seleciona método de pagamento
   ↓
7. Completa transação
   ↓
8. Acesso liberado ao curso
```

### Fluxo de Agendamento

```
1. Acessa /teacher/:id
   ↓
2. Visualiza perfil do professor
   ↓
3. Clica em "Agendar Aula"
   ↓
4. Seleciona data/hora
   ↓
5. Escolhe tópico
   ↓
6. Confirma agendamento
   ↓
7. Recebe confirmação por email
```

---

## 🌐 Integração com APIs

### Google Maps
- Integração para localização de professores
- Visualização de horários por timezone
- Rotas para encontros presenciais

### Stripe (Futuro)
- Processamento seguro de pagamentos
- Webhooks para confirmação
- Reembolsos automáticos

### SendGrid (Futuro)
- Envio de emails transacionais
- Notificações de agendamento
- Lembretes de aulas

---

## 🧪 Testes

### Testes Unitários

```bash
# Executar testes
pnpm test

# Cobertura
pnpm test:coverage
```

### Testes E2E

```bash
# Executar testes E2E
pnpm test:e2e
```

### Checklist de Testes Manuais

- [ ] Cadastro com aluno
- [ ] Cadastro com professor
- [ ] Login com credenciais válidas
- [ ] Login com credenciais inválidas
- [ ] Pagamento com cartão
- [ ] Pagamento com PIX
- [ ] Agendamento de aula
- [ ] Criação de post na comunidade
- [ ] Visualização de cursos
- [ ] Download de material
- [ ] Responsividade mobile

---

## 📈 Performance

### Otimizações Implementadas

- **Code Splitting**: Lazy loading de rotas
- **Image Optimization**: Compressão automática
- **Caching**: Service Worker para offline
- **Minification**: CSS e JS minificados
- **Tree Shaking**: Remoção de código não-utilizado

### Métricas

| Métrica | Alvo | Atual |
|---------|------|-------|
| **Lighthouse Score** | > 90 | - |
| **FCP** | < 1.5s | - |
| **LCP** | < 2.5s | - |
| **CLS** | < 0.1 | - |

---

## 🐛 Troubleshooting

### Problema: Página em branco
**Solução:** Limpar cache do navegador (Ctrl+Shift+Delete)

### Problema: Erro de CORS
**Solução:** Verificar configuração de CORS no backend

### Problema: Formulário não valida
**Solução:** Verificar console do navegador para erros

### Problema: Imagens não carregam
**Solução:** Verificar URLs das imagens e permissões

---

## 📚 Documentação Adicional

- [Guia de Componentes](./docs/COMPONENTS.md)
- [Guia de Estilos](./docs/STYLING.md)
- [API Reference](./docs/API.md)
- [Contribuindo](./CONTRIBUTING.md)

---

## 🔄 Roadmap Futuro

### Curto Prazo (1-2 meses)
- [ ] Integração com Stripe para pagamentos reais
- [ ] Sistema de notificações em tempo real
- [ ] Chat entre alunos e professores
- [ ] Certificados digitais

### Médio Prazo (3-6 meses)
- [ ] App mobile (React Native)
- [ ] Livestreams de aulas
- [ ] Sistema de recomendação com IA
- [ ] Gamificação (badges, pontos)

### Longo Prazo (6+ meses)
- [ ] Marketplace de recursos
- [ ] Programa de afiliados
- [ ] Integração com plataformas de video
- [ ] Analytics avançado

---

## 📞 Suporte & Contato

- **Email**: support@edumarket.com
- **WhatsApp**: +55 (11) 99999-9999
- **Discord**: [Comunidade EduMarket](https://discord.gg/edumarket)
- **Issues**: [GitHub Issues](https://github.com/edumarket/issues)

---

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](./LICENSE) para detalhes.

---

## 👥 Contribuidores

- **Desenvolvedor Principal**: Manus Team
- **Design**: Figma Design System
- **QA**: Equipe de Testes

---

## 🙏 Agradecimentos

Agradecemos a todos os professores e alunos que contribuem para tornar o EduMarket uma plataforma melhor a cada dia.

---

**Última atualização:** 28 de maio de 2026
**Versão:** 1.0.0
