import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import {
  Play, Star, Clock, Users, GraduationCap, BookOpen,
  CheckCircle, ChevronRight, ChevronLeft, ShoppingCart, Zap, X
} from 'lucide-react';
import { useLang } from '@/contexts/LangContext';

interface Curso {
  id: string; titulo: string; descricao: string; preco: number; dataCompra: string;
}
interface Aula {
  id: number; titulo: string; duracao: string; concluida: boolean; start?: number;
}

interface Modulo {
  id: number;
  titulo: string;
  aulas: Aula[];
}

const VIDEOS: Record<string, {
  videoId: string; duracao: string; nivel: string; alunos: string; rating: string; modulos: Modulo[]
}> = {
  'Desenvolvimento Web': {
    videoId: 'SqcY0GlETPk', duracao: '12h 30min', nivel: 'Iniciante ao Avançado', alunos: '45.2k', rating: '4.8',
    modulos: [
      { id: 1, titulo: 'Módulo 1 — HTML', aulas: [
        { id: 1, titulo: 'Introdução ao HTML', duracao: '45 min', concluida: true, start: 0 },
        { id: 2, titulo: 'Tags e Semântica', duracao: '30 min', concluida: true, start: 2700 },
        { id: 3, titulo: 'Formulários HTML', duracao: '25 min', concluida: false, start: 5400 },
      ]},
      { id: 2, titulo: 'Módulo 2 — CSS', aulas: [
        { id: 4, titulo: 'CSS Fundamentos', duracao: '50 min', concluida: false, start: 7200 },
        { id: 5, titulo: 'Flexbox e Grid', duracao: '40 min', concluida: false, start: 10200 },
        { id: 6, titulo: 'Responsivo', duracao: '35 min', concluida: false, start: 12600 },
      ]},
      { id: 3, titulo: 'Módulo 3 — JavaScript', aulas: [
        { id: 7, titulo: 'JS Básico', duracao: '60 min', concluida: false, start: 15000 },
        { id: 8, titulo: 'DOM e Eventos', duracao: '45 min', concluida: false, start: 18600 },
        { id: 9, titulo: 'Fetch e APIs', duracao: '40 min', concluida: false, start: 21300 },
      ]},
    ],
  },
  'Python': {
    videoId: 'rfscVS0vtbw', duracao: '8h 15min', nivel: 'Iniciante ao Avançado', alunos: '38.7k', rating: '4.9',
    modulos: [
      { id: 1, titulo: 'Módulo 1 — Fundamentos', aulas: [
        { id: 1, titulo: 'Instalação e Setup', duracao: '20 min', concluida: true, start: 0 },
        { id: 2, titulo: 'Variáveis e Tipos', duracao: '35 min', concluida: true, start: 1200 },
        { id: 3, titulo: 'Condicionais e Loops', duracao: '40 min', concluida: false, start: 3300 },
      ]},
      { id: 2, titulo: 'Módulo 2 — Estruturas', aulas: [
        { id: 4, titulo: 'Listas e Dicionários', duracao: '45 min', concluida: false, start: 5700 },
        { id: 5, titulo: 'Funções e Classes', duracao: '50 min', concluida: false, start: 8400 },
      ]},
      { id: 3, titulo: 'Módulo 3 — Data Science', aulas: [
        { id: 6, titulo: 'Pandas Básico', duracao: '55 min', concluida: false, start: 11400 },
        { id: 7, titulo: 'NumPy e Visualização', duracao: '60 min', concluida: false, start: 14700 },
        { id: 8, titulo: 'Machine Learning Intro', duracao: '70 min', concluida: false, start: 18300 },
      ]},
    ],
  },
  'UI/UX': {
    videoId: 'lHOlAEAMIX0', duracao: '6h 45min', nivel: 'Intermediário', alunos: '22.1k', rating: '4.7',
    modulos: [
      { id: 1, titulo: 'Módulo 1 — Design Thinking', aulas: [
        { id: 1, titulo: 'Princípios de UX', duracao: '35 min', concluida: true, start: 0 },
        { id: 2, titulo: 'Pesquisa com Usuário', duracao: '40 min', concluida: false, start: 2100 },
      ]},
      { id: 2, titulo: 'Módulo 2 — Figma', aulas: [
        { id: 3, titulo: 'Interface do Figma', duracao: '30 min', concluida: false, start: 4500 },
        { id: 4, titulo: 'Componentes e Estilos', duracao: '45 min', concluida: false, start: 6300 },
        { id: 5, titulo: 'Prototipação Avançada', duracao: '50 min', concluida: false, start: 9000 },
      ]},
      { id: 3, titulo: 'Módulo 3 — Projeto Final', aulas: [
        { id: 6, titulo: 'App do Zero ao Protótipo', duracao: '80 min', concluida: false, start: 12000 },
      ]},
    ],
  },
  'Flutter': {
    videoId: 'VPvVD8t02U8', duracao: '10h 20min', nivel: 'Iniciante ao Avançado', alunos: '31.4k', rating: '4.8',
    modulos: [
      { id: 1, titulo: 'Módulo 1 — Dart', aulas: [
        { id: 1, titulo: 'Introdução ao Dart', duracao: '40 min', concluida: true, start: 0 },
        { id: 2, titulo: 'POO em Dart', duracao: '45 min', concluida: false, start: 2400 },
      ]},
      { id: 2, titulo: 'Módulo 2 — Flutter Básico', aulas: [
        { id: 3, titulo: 'Widgets Essenciais', duracao: '60 min', concluida: false, start: 5100 },
        { id: 4, titulo: 'Layouts e Navegação', duracao: '55 min', concluida: false, start: 8700 },
        { id: 5, titulo: 'State Management', duracao: '65 min', concluida: false, start: 12000 },
      ]},
      { id: 3, titulo: 'Módulo 3 — App Completo', aulas: [
        { id: 6, titulo: 'Integração com API', duracao: '70 min', concluida: false, start: 15900 },
        { id: 7, titulo: 'Firebase e Auth', duracao: '60 min', concluida: false, start: 20100 },
        { id: 8, titulo: 'Deploy na Loja', duracao: '45 min', concluida: false, start: 23700 },
      ]},
    ],
  },
  'DevOps': {
    videoId: 'Wvf0mBNGjXY', duracao: '9h 00min', nivel: 'Intermediário', alunos: '18.9k', rating: '4.6',
    modulos: [
      { id: 1, titulo: 'Módulo 1 — Docker', aulas: [
        { id: 1, titulo: 'Conceitos de Container', duracao: '40 min', concluida: true, start: 0 },
        { id: 2, titulo: 'Dockerfile', duracao: '45 min', concluida: false, start: 2400 },
        { id: 3, titulo: 'Docker Compose', duracao: '50 min', concluida: false, start: 5100 },
      ]},
      { id: 2, titulo: 'Módulo 2 — Kubernetes', aulas: [
        { id: 4, titulo: 'Arquitetura K8s', duracao: '55 min', concluida: false, start: 8100 },
        { id: 5, titulo: 'Pods e Deployments', duracao: '60 min', concluida: false, start: 11400 },
      ]},
      { id: 3, titulo: 'Módulo 3 — CI/CD', aulas: [
        { id: 6, titulo: 'GitHub Actions', duracao: '50 min', concluida: false, start: 15000 },
        { id: 7, titulo: 'Pipeline Completo', duracao: '65 min', concluida: false, start: 18000 },
      ]},
    ],
  },
  'Banco de Dados': {
    videoId: 'HXV3zeQKqGY', duracao: '7h 30min', nivel: 'Iniciante ao Avançado', alunos: '27.3k', rating: '4.8',
    modulos: [
      { id: 1, titulo: 'Módulo 1 — SQL', aulas: [
        { id: 1, titulo: 'Introdução ao SQL', duracao: '35 min', concluida: true, start: 0 },
        { id: 2, titulo: 'SELECT e Filtros', duracao: '40 min', concluida: false, start: 2100 },
        { id: 3, titulo: 'JOINs', duracao: '45 min', concluida: false, start: 4500 },
      ]},
      { id: 2, titulo: 'Módulo 2 — SQL Avançado', aulas: [
        { id: 4, titulo: 'Subqueries', duracao: '40 min', concluida: false, start: 7200 },
        { id: 5, titulo: 'Índices e Performance', duracao: '45 min', concluida: false, start: 9600 },
      ]},
      { id: 3, titulo: 'Módulo 3 — NoSQL', aulas: [
        { id: 6, titulo: 'Introdução ao MongoDB', duracao: '40 min', concluida: false, start: 12300 },
        { id: 7, titulo: 'Operações CRUD', duracao: '45 min', concluida: false, start: 14700 },
        { id: 8, titulo: 'Redis na Prática', duracao: '40 min', concluida: false, start: 17400 },
      ]},
    ],
  },
};

const DEFAULT = {
  videoId: 'SqcY0GlETPk', duracao: '8h', nivel: 'Iniciante', alunos: '20k', rating: '4.8',
  modulos: [{ id: 1, titulo: 'Módulo 1', aulas: [{ id: 1, titulo: 'Aula 1', duracao: '45 min', concluida: false, start: 0 }] }]
};

function getData(titulo: string) {
  const tituloLower = titulo.toLowerCase();
  for (const key of Object.keys(VIDEOS)) {
    if (tituloLower.includes(key.toLowerCase())) return VIDEOS[key];
  }
  // Fallbacks por palavras-chave comuns
  if (tituloLower.includes('web') || tituloLower.includes('html') || tituloLower.includes('react')) return VIDEOS['Desenvolvimento Web'];
  if (tituloLower.includes('python') || tituloLower.includes('data')) return VIDEOS['Python'];
  if (tituloLower.includes('design') || tituloLower.includes('ux') || tituloLower.includes('ui')) return VIDEOS['UI/UX'];
  if (tituloLower.includes('flutter') || tituloLower.includes('mobile') || tituloLower.includes('dart')) return VIDEOS['Flutter'];
  if (tituloLower.includes('docker') || tituloLower.includes('devops') || tituloLower.includes('kubernetes')) return VIDEOS['DevOps'];
  if (tituloLower.includes('banco') || tituloLower.includes('sql') || tituloLower.includes('nosql') || tituloLower.includes('mongodb')) return VIDEOS['Banco de Dados'];
  return DEFAULT;
}

const CURSOS_DESTAQUE = [
  { key: 'Desenvolvimento Web', titulo: 'Desenvolvimento Web Completo', descricao: 'HTML, CSS, JavaScript, React e Node.js', preco: 99.90 },
  { key: 'Python',             titulo: 'Python para Data Science',       descricao: 'Pandas, NumPy e Machine Learning',      preco: 119.90 },
  { key: 'UI/UX',             titulo: 'UI/UX Design na Prática',         descricao: 'Figma, prototipação e design',           preco: 89.90 },
  { key: 'Flutter',           titulo: 'Flutter & Dart Mobile',           descricao: 'Apps iOS e Android do zero',             preco: 109.90 },
  { key: 'DevOps',            titulo: 'DevOps e Docker',                 descricao: 'Docker, Kubernetes e CI/CD',             preco: 129.90 },
  { key: 'Banco de Dados',    titulo: 'Banco de Dados SQL e NoSQL',      descricao: 'PostgreSQL, MongoDB e Redis',            preco: 79.90 },
];

type Tab = 'meus' | 'explorar';

export default function MeusCursos() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selected, setSelected] = useState<Curso | null>(null);
  const [aulaAtiva, setAulaAtiva] = useState<Aula | null>(null);
  const [carIdx, setCarIdx] = useState(0);
  const [tab, setTab] = useState<Tab>('meus');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }

    // Carregar todos os cursos comprados
    const raw = JSON.parse(localStorage.getItem('meus_cursos') || '[]');
    setCursos(raw);
  }, []);

  // Auto carrossel
  useEffect(() => {
    const timer = setInterval(() => setCarIdx(i => (i + 1) % CURSOS_DESTAQUE.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const data = selected ? getData(selected.titulo) : null;
  const todasAulas = data ? data.modulos.flatMap(m => m.aulas) : [];
  const aulaSelecionada = aulaAtiva ?? todasAulas[0] ?? null;
  const concluidas = todasAulas.filter(a => a.concluida).length;
  const progresso = todasAulas.length > 0 ? Math.round((concluidas / todasAulas.length) * 100) : 0;

  // ── Player ──────────────────────────────────────────
  if (selected && data) {
    return (
      <PageWrapper>
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button variant="outline" onClick={() => { setSelected(null); setAulaAtiva(null); }} className="mb-6 flex items-center gap-2">
            ← Voltar aos Meus Cursos
          </Button>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Player */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${data.videoId}?autoplay=1&rel=0&start=${aulaSelecionada?.start ?? 0}`}
                  title={aulaSelecionada?.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-card border rounded-xl p-5">
                <h2 className="text-xl font-bold mb-1">{aulaSelecionada?.titulo}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {aulaSelecionada?.duracao}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> Aula {aulaSelecionada?.id}</span>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">⬇ Baixar Material</Button>
                  <Button variant="outline">↗ Compartilhar</Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="bg-card border rounded-xl p-5 space-y-4">
              <div>
                <h3 className="font-bold text-lg">{selected.titulo}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{data.rating}</span>
                  <span className="text-muted-foreground text-sm">({data.alunos} alunos)</span>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">Progresso</span>
                  <span className="text-purple-600 font-bold">{progresso}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full" style={{ width: `${progresso}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{concluidas} de {todasAulas.length} aulas concluídas</p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Conteúdo do Curso</h4>
                <div className="space-y-3">
                  {data.modulos.map(modulo => (
                    <div key={modulo.id}>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide px-1 mb-1">{modulo.titulo}</p>
                      <div className="space-y-1">
                        {modulo.aulas.map(aula => (
                          <button key={aula.id} onClick={() => setAulaAtiva(aula)}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all ${
                              aulaSelecionada?.id === aula.id
                                ? 'bg-purple-100 dark:bg-purple-900 border border-purple-300 dark:border-purple-700'
                                : 'hover:bg-muted'
                            }`}
                          >
                            {aula.concluida
                              ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                              : <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${aulaSelecionada?.id === aula.id ? 'border-purple-600' : 'border-gray-400'}`}>
                                  {aulaSelecionada?.id === aula.id && <Play className="w-2 h-2 fill-purple-600 text-purple-600" />}
                                </div>
                            }
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-medium truncate ${aula.concluida ? 'text-green-600 dark:text-green-400' : ''}`}>{aula.titulo}</p>
                              <p className="text-xs text-muted-foreground">{aula.duracao}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // ── Listagem principal ───────────────────────────────
  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header com abas */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <GraduationCap className="w-7 h-7 text-purple-600" /> Meus Cursos
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Acesse seus cursos e continue aprendendo</p>
          </div>
          {cursos.length > 0 && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-semibold px-3 py-1 rounded-full">
              {cursos.length} {cursos.length === 1 ? 'curso' : 'cursos'}
            </span>
          )}
        </div>

        {/* Abas */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit mb-8">
          <button
            onClick={() => setTab('meus')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'meus'
                ? 'bg-white dark:bg-gray-800 shadow text-purple-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📚 Meus Cursos {cursos.length > 0 && `(${cursos.length})`}
          </button>
          <button
            onClick={() => setTab('explorar')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === 'explorar'
                ? 'bg-white dark:bg-gray-800 shadow text-purple-600'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🔍 Explorar Cursos
          </button>
        </div>

        {/* ── ABA: MEUS CURSOS ── */}
        {tab === 'meus' && (
          cursos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
              <GraduationCap className="w-16 h-16" />
              <div className="text-center">
                <p className="font-semibold text-xl mb-1">Você ainda não tem cursos</p>
                <p className="text-sm mb-4">Explore nossos cursos e comece a aprender!</p>
                <Button
                  onClick={() => setTab('explorar')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Explorar cursos
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cursos.map(curso => {
                const v = getData(curso.titulo);
                const todasA = v.modulos.flatMap(m => m.aulas);
                const conc = todasA.filter(a => a.concluida).length;
                const prog = Math.round((conc / todasA.length) * 100);
                return (
                  <div key={curso.id} onClick={() => setSelected(curso)}
                    className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <img src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`} alt={curso.titulo} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-all shadow-lg">
                          <Play className="w-5 h-5 text-purple-600 fill-purple-600 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">✓ Adquirido</div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">{v.duracao}</div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-1 line-clamp-1">{curso.titulo}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{curso.descricao}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {v.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {v.alunos}</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {v.modulos.flatMap(m => m.aulas).length} aulas</span>
                      </div>
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{conc} de {todasA.length} aulas</span>
                          <span className="text-purple-600 font-semibold">{prog}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-1.5 rounded-full" style={{ width: `${prog}%` }} />
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-2">
                        <Play className="w-4 h-4" /> Continuar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* ── ABA: EXPLORAR ── */}
        {tab === 'explorar' && (
          <div className="space-y-8">
            {/* Carrossel */}
            <div className="relative rounded-2xl overflow-hidden h-72 shadow-xl">
              {CURSOS_DESTAQUE.map((curso, idx) => {
                const v = VIDEOS[curso.key];
                return (
                  <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx === carIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <img src={`https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`} alt={curso.titulo} className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-bold text-2xl mb-1">{curso.titulo}</p>
                      <p className="text-white/70 text-sm mb-3">{curso.descricao}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-white font-bold text-xl">R$ {curso.preco.toFixed(2)}</span>
                        <Button onClick={() => setLocation('/anuncios')} className="bg-white text-purple-700 hover:bg-purple-50 font-bold">
                          <ShoppingCart className="w-4 h-4 mr-2" /> Ver curso
                        </Button>
                        <span className="text-white/60 text-xs">🏷️ Use JAUM para 100% off</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={() => setCarIdx(i => (i - 1 + CURSOS_DESTAQUE.length) % CURSOS_DESTAQUE.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white">‹</button>
              <button onClick={() => setCarIdx(i => (i + 1) % CURSOS_DESTAQUE.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/40 hover:bg-black/70 rounded-full flex items-center justify-center text-white">›</button>
              <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
                {CURSOS_DESTAQUE.map((_, i) => (
                  <button key={i} onClick={() => setCarIdx(i)}
                    className={`rounded-full transition-all ${i === carIdx ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`} />
                ))}
              </div>
            </div>

            {/* Grid de todos os cursos */}
            <div>
              <h2 className="text-xl font-bold mb-4">Todos os cursos</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {CURSOS_DESTAQUE.map((curso, idx) => {
                  const v = VIDEOS[curso.key];
                  return (
                    <div key={idx} className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
                      <div className="relative cursor-pointer" style={{ paddingBottom: '56.25%' }} onClick={() => setLocation('/anuncios')}>
                        <img src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`} alt={curso.titulo} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                            <Play className="w-5 h-5 text-purple-600 fill-purple-600 ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">{v.duracao}</div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-1 line-clamp-1">{curso.titulo}</h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{curso.descricao}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />{v.rating}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{v.alunos}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-purple-600">R$ {curso.preco.toFixed(2)}</span>
                          <Button size="sm" onClick={() => setLocation('/anuncios')} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" /> Comprar
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banner cupom */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-center text-white">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <h2 className="text-xl font-bold mb-1">🎉 Use o cupom <span className="bg-white/20 px-3 py-1 rounded-lg font-mono">JAUM</span> e ganhe 100% de desconto!</h2>
              <p className="text-purple-100 text-sm">Adquira qualquer curso gratuitamente usando o cupom na hora do pagamento.</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
