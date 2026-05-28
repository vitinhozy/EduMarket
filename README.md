Template de Aplicação Web (Frontend Estático)

Template puro com React 19 + Tailwind 4 e shadcn/ui já configurado. Use este README como checklist para entregar experiências estáticas.

Nota: Este template inclui diretórios mínimos shared/ e server/ com tipos placeholders para suportar templates importados. Eles são apenas placeholders de compatibilidade — web-static continua sendo um template totalmente estático, sem funcionalidade de API.

Visão Geral da Stack
Roteamento client-side usando React + Wouter.
Os design tokens ficam inteiramente em client/src/index.css — mantenha esse arquivo intacto.
Estrutura de Arquivos
client/
  public/       ← SOMENTE pequenos arquivos de configuração (favicon.ico, robots.txt). NÃO coloque imagens/mídia aqui.
  src/
    pages/      ← Componentes de páginas
    components/ ← Componentes reutilizáveis UI & shadcn/ui
    contexts/   ← Contextos React
    hooks/      ← Hooks customizados
    lib/        ← Helpers utilitários
    App.tsx     ← Rotas & layout principal
    main.tsx    ← Ponto de entrada React
    index.css   ← Estilo global
server/         ← Placeholder para compatibilidade com templates importados
shared/         ← Placeholder para compatibilidade com templates importados
  const.ts      ← Constantes compartilhadas
⚠️ Lidando com Imagens & Mídia

NÃO armazene imagens, vídeos ou assets grandes em client/public/ ou client/src/assets/. Arquivos locais de mídia causarão timeout no deploy.

Fluxo obrigatório:
Faça upload dos assets usando o CLI:
manus-upload-file --webdev caminho/para/imagem.png
Use o caminho retornado diretamente no código:
<img src="/manus-storage/image_a1b2c3d4.png" />
Armazene o arquivo original localmente em:
/home/ubuntu/webdev-static-assets/

(fora do diretório do projeto)

Somente pequenos arquivos de configuração como favicon.ico, robots.txt e manifest.json devem ficar em client/public/.

Arquivos dentro de client/public ficam disponíveis na raiz do site — referencie-os com caminhos absolutos (/robots.txt, etc.) em templates HTML, JSX ou meta tags.

🎯 Fluxo de Desenvolvimento
Escolha um estilo de design antes de escrever qualquer código frontend de acordo com o Guia de Design (cores, fontes, sombras, estilo artístico). Informe ao usuário o estilo escolhido. Lembre-se de editar client/src/index.css para o tema global e adicionar a fonte necessária usando CDN do Google Fonts em client/index.html.
Monte as páginas em client/src/pages/. Mantenha as seções modulares para que possam ser reutilizadas entre rotas.
Compartilhe componentes base via client/src/components/ — estenda componentes do shadcn/ui quando necessário ao invés de duplicar markup.
Mantenha consistência visual usando os tokens já existentes do Tailwind (espaçamento, cores, tipografia).
Busque dados externos usando useEffect se o site precisar de conteúdo dinâmico vindo de APIs públicas.
🎨 Diretrizes de Desenvolvimento Frontend
UI & Estilização
Prefira componentes do shadcn/ui para interações e manter um visual moderno e consistente; importe de @/components/ui/* (ex.: button, card, dialog).
Combine utilitários Tailwind com variantes de componentes para layout e estados; evite CSS customizado em excesso. Use variant, size, etc. sempre que possível.
Preserve os design tokens: mantenha as regras @layer base em client/src/index.css. Utilitários como border-border e font-sans dependem disso.
Linguagem visual consistente: use espaçamentos, bordas arredondadas, sombras e tipografia via tokens. Extraia UI compartilhada em components/ ao invés de copiar e colar.
Acessibilidade e responsividade: mantenha focus rings visíveis e garanta navegação por teclado; desenvolva mobile-first com breakpoints bem pensados.
Temas: escolha inicialmente tema escuro/claro para o ThemeProvider de acordo com o estilo visual escolhido e gerencie a paleta via variáveis CSS em client/src/index.css em vez de hardcode.
Microinterações e estados vazios: adicione motion, empty states e ícones com moderação para melhorar a qualidade sem distrair.
Navegação:
Ferramentas internas/painéis administrativos → use sidebar persistente.
Apps públicos → escolha navegação baseada na estrutura do conteúdo (top nav, side nav, contextual), sempre com rotas claras de retorno.
Elementos placeholder: ao adicionar elementos estruturais não implementados (nav items, CTAs), exiba um toast ao clicar (“Feature coming soon”). Informe ao usuário quais elementos ainda são placeholders.
Boas práticas React
Nunca chame setState/navegação durante a renderização → encapsule em useEffect.
Defaults customizados

Este template customiza alguns padrões do Tailwind/shadcn para simplificar o uso:

.container

Centraliza automaticamente e adiciona padding responsivo (veja index.css).

Use diretamente:

<div className="container">...</div>

Para larguras customizadas:

<div className="max-w-6xl mx-auto px-4">...</div>
.flex

Possui min-width:0 e min-height:0 por padrão.

Variante outline de button

Usa background transparente (não bg-background). Adicione classes de fundo manualmente se necessário.

🎨 Guia de Design

Ao gerar UI frontend, evite padrões genéricos sem identidade visual:

Evite layouts centralizados genéricos ocupando a tela inteira — prefira estruturas assimétricas/sidebar/grid para landing pages e dashboards.
Quando o usuário fornecer requisitos vagos, tome decisões criativas de design (paleta específica, tipografia, layout).
Priorize diversidade visual: combine diferentes sistemas de design (uma paleta + tipografia diferente + outro princípio de layout).
Landing pages:
Prefira layouts assimétricos
Cores específicas (não apenas “azul”)
Backgrounds texturizados ao invés de cores chapadas
Dashboards:
Use sistemas de espaçamento definidos
Sombras suaves ao invés de bordas
Cores de destaque para hierarquia visual
Guia de Animação

Motion deve fazer parte do projeto desde o início.

Decida se deve haver animação:
Interações via teclado (command palettes, atalhos) devem ser instantâneas.
Interações frequentes (hover, navegação em listas) → motion mínimo.
Reserve animações ricas para eventos ocasionais (modais, drawers, toasts) e momentos especiais (onboarding).
Mantenha animações abaixo de 300ms:
Botões: 100–160ms
Tooltips: 125–200ms
Dropdowns: 150–250ms
Modais/drawers: 200–500ms
Use curvas customizadas:
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
NUNCA use ease-in para animações de UI.
Botões devem parecer responsivos:
transform: scale(0.97)

com transição ~160ms ease-out.

Nunca anime de scale(0):
Use scale(0.95) + opacity: 0.
Popovers/dropdowns devem surgir do ponto de origem:
transform-origin: var(--radix-popover-content-transform-origin)
Prefira CSS transitions ao invés de @keyframes para estados dinâmicos.
Anime apenas:
transform
opacity

Evite animar:

width
height
padding
margin
top/left
Faça stagger de elementos em grupo:
30–80ms por item.
Timings assimétricos:
Hold-to-confirm → lento e linear (~2s)
Cancelar → rápido (~200ms ease-out)
Respeite prefers-reduced-motion:
@media (prefers-reduced-motion: no-preference)
Componentes Pré-construídos

Antes de implementar funcionalidades UI, verifique se estes componentes já existem:

Mapas
client/src/components/Map.tsx
Integração com Google Maps usando autenticação via proxy.
Fornece MapView com callback onMapReady.
Permite usar:
Places
Geocoder
Directions
Drawing
etc.

Ao implementar algo relacionado a mapas, você DEVE avaliar este componente antes de criar outro.

🗺️ Integração com Google Maps

CRÍTICO: O proxy Manus fornece acesso COMPLETO a TODOS os recursos do Google Maps — incluindo drawing, heatmaps, Street View, layers, Places API etc.

NUNCA peça API key ao usuário.

Implementação
Frontend

Importe MapView:

import MapView from "@/components/Map";

Inicialize qualquer serviço do Google Maps no callback onMapReady.

Todos os recursos da Google Maps JavaScript API funcionam diretamente no browser.

NUNCA use bibliotecas externas de mapas ou solicite chaves API.

✅ Checklist de Entrega
 Estrutura de layout e navegação correta
 Todos os src de imagens válidos
 Fluxos de sucesso e erro verificados no navegador
Referências Principais de Arquivos
package.json
{
  "name": "edumarket_v2",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "preview": "vite preview --host",
    "check": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
client/src/App.tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Fallback final */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
client/src/pages/Home.tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Streamdown } from 'streamdown';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <Loader2 className="animate-spin" />

        Example Page

        <Streamdown>
          Any **markdown** content
        </Streamdown>

        <Button variant="default">
          Example Button
        </Button>
      </main>
    </div>
  );
}
client/src/index.css
@import "tailwindcss";
@import "tw-animate-css";

(arquivo completo mantido igual ao original — apenas traduções conceituais foram feitas acima)

client/index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1"
    />

    <title>{{project_title}}</title>

    <!-- Adicione Google Fonts aqui -->
  </head>

  <body>
    <div id="root"></div>

    <script type="module" src="/src/main.tsx"></script>

    <script
      defer
      src="%VITE_ANALYTICS_ENDPOINT%/umami"
      data-website-id="%VITE_ANALYTICS_WEBSITE_ID%">
    </script>
  </body>
</html>
server/index.ts
import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
Armadilhas Comuns
Loops infinitos de loading por referências instáveis
❌ Anti-pattern
const { data } = trpc.items.getByDate.useQuery({
  date: new Date(),
});
✅ Correto
const [date] = useState(() => new Date());

ou

const ids = useMemo(() => [1, 2, 3], []);
Motivo

Objetos/arrays criados durante renderização possuem nova referência a cada render → re-fetch infinito.

Dead-ends de navegação
Problema

Criar rotas aninhadas sem:

header
sidebar
botão voltar
Solução

Defina um layout global primeiro em App.tsx.

Texto invisível por conflito de tema
Regras críticas
O defaultTheme deve combinar com .dark {} no CSS.
Sempre combine:
bg-card text-card-foreground

e não apenas:

bg-card
Tags <a> aninhadas
❌ Errado
<Link>
  <a>...</a>
</Link>
✅ Correto
<Link>...</Link>
Select.Item vazio

Cada:

<Select.Item />

DEVE possuir:

value="algum-valor"

Nunca:

""
undefined
omitido
Toasts

Use:

sonner

NÃO adicione:

react-toastify
@radix-ui/react-toast
Rotas Placeholder

Se adicionar placeholders no App.tsx, eles DEVEM ser substituídos posteriormente por componentes reais.
