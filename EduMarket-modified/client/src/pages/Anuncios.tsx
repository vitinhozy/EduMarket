import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, ShoppingCart, Play, X, Star, Clock, Users, Search, Tag, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '@/contexts/LangContext';

interface Aula { id: number; titulo: string; descricao: string; preco: number; }

const VIDEOS: Record<string, {
  videoId: string; duracao: string; nivel: string; alunos: string; rating: string;
  categoria: string; topicos: string[]; instrutor: string;
}> = {
  'Desenvolvimento Web': {
    videoId: 'SqcY0GlETPk', duracao: '12h 30min', nivel: 'Iniciante', alunos: '45.2k',
    rating: '4.8', categoria: 'Web', instrutor: 'Mario Soares',
    topicos: ['HTML5 e CSS3', 'JavaScript ES6+', 'React 18', 'Node.js', 'APIs REST'],
  },
  'Python': {
    videoId: 'rfscVS0vtbw', duracao: '8h 15min', nivel: 'Iniciante', alunos: '38.7k',
    rating: '4.9', categoria: 'Data Science', instrutor: 'Gustavo Guanabara',
    topicos: ['Python básico ao avançado', 'Pandas e NumPy', 'Visualização de dados', 'Machine Learning'],
  },
  'UI/UX': {
    videoId: 'lHOlAEAMIX0', duracao: '6h 45min', nivel: 'Intermediário', alunos: '22.1k',
    rating: '4.7', categoria: 'Design', instrutor: 'Ana Luiza',
    topicos: ['Princípios de UX', 'Figma do zero', 'Prototipação', 'Design System'],
  },
  'Flutter': {
    videoId: 'VPvVD8t02U8', duracao: '10h 20min', nivel: 'Iniciante', alunos: '31.4k',
    rating: '4.8', categoria: 'Mobile', instrutor: 'Felipe Deschamps',
    topicos: ['Dart language', 'Flutter widgets', 'State Management', 'Deploy iOS/Android'],
  },
  'DevOps': {
    videoId: 'Wvf0mBNGjXY', duracao: '9h 00min', nivel: 'Intermediário', alunos: '18.9k',
    rating: '4.6', categoria: 'DevOps', instrutor: 'Rafael Gomes',
    topicos: ['Docker containers', 'Kubernetes', 'CI/CD Pipeline', 'Cloud deploy'],
  },
  'Banco de Dados': {
    videoId: 'HXV3zeQKqGY', duracao: '7h 30min', nivel: 'Iniciante', alunos: '27.3k',
    rating: '4.8', categoria: 'Banco de Dados', instrutor: 'Carlos Silva',
    topicos: ['SQL fundamentos', 'JOINs e subqueries', 'MongoDB', 'Redis'],
  },
};

function getVideo(titulo: string) {
  for (const key of Object.keys(VIDEOS)) {
    if (titulo.includes(key)) return VIDEOS[key];
  }
  return VIDEOS['Desenvolvimento Web'];
}

const CATEGORIAS = ['Todas', 'Web', 'Data Science', 'Design', 'Mobile', 'DevOps', 'Banco de Dados'];

export default function Anuncios() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Aula | null>(null);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const [carrinhoIds, setCarrinhoIds] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/anuncios').then(r => r.json()).then(data => { setAulas(data); setLoading(false); }).catch(() => setLoading(false));
    const c = JSON.parse(localStorage.getItem('carrinho') || '[]');
    setCarrinhoIds(c.map((i: any) => String(i.id)));
  }, []);

  const handleAddCarrinho = (aula: Aula) => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    if (carrinho.find((i: any) => i.id === String(aula.id))) { toast.error(t('ads_already')); return; }
    const novo = [...carrinho, { id: String(aula.id), titulo: aula.titulo, descricao: aula.descricao, preco: aula.preco ?? 99.90 }];
    localStorage.setItem('carrinho', JSON.stringify(novo));
    setCarrinhoIds(prev => [...prev, String(aula.id)]);
    toast.success(`"${aula.titulo}" adicionado ao carrinho!`);
  };

  const aulasFiltradas = aulas.filter(a => {
    const v = getVideo(a.titulo);
    const matchBusca = a.titulo.toLowerCase().includes(busca.toLowerCase()) || a.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoria === 'Todas' || v.categoria === categoria;
    return matchBusca && matchCat;
  });

  const video = selected ? getVideo(selected.titulo) : null;

  return (
    <PageWrapper>
      <Navigation />

      {/* Modal de preview */}
      {selected && video && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe className="absolute inset-0 w-full h-full rounded-t-2xl"
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                title={selected.titulo} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            <div className="p-6 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">{video.categoria}</span>
                  <h2 className="text-2xl font-bold mt-2">{selected.titulo}</h2>
                  <p className="text-muted-foreground mt-1">{selected.descricao}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-yellow-500 font-semibold"><Star className="w-4 h-4 fill-yellow-500" /> {video.rating}</span>
                  <span className="text-muted-foreground">({video.alunos} alunos)</span>
                  <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" /> {video.duracao}</span>
                  <span className="text-muted-foreground">👤 {video.instrutor}</span>
                </div>
                <div>
                  <p className="font-semibold mb-2">O que você vai aprender:</p>
                  <div className="grid grid-cols-2 gap-1">
                    {video.topicos.map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 space-y-4 h-fit">
                <div>
                  <p className="text-3xl font-bold text-purple-600">R$ {(selected.preco ?? 99.90).toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Tag className="w-3 h-3" /> Cupom <strong>JAUM</strong> = 100% grátis!</p>
                </div>
                <Button onClick={() => { handleAddCarrinho(selected); setSelected(null); }}
                  disabled={carrinhoIds.includes(String(selected.id))}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold">
                  {carrinhoIds.includes(String(selected.id)) ? '✓ No carrinho' : 'Adicionar ao carrinho'}
                </Button>
                <Button variant="outline" onClick={() => { setLocation('/carrinho'); }} className="w-full">Ver carrinho</Button>
                <p className="text-xs text-center text-muted-foreground">30 dias de garantia</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-3">Expanda suas habilidades em tecnologia</h1>
          <p className="text-purple-200 text-lg mb-6">Aprenda com os melhores cursos online e avance na sua carreira</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="Buscar cursos..." value={busca} onChange={e => setBusca(e.target.value)}
              className="pl-12 py-6 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-0 rounded-xl shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Filtros de categoria */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIAS.map(cat => (
            <button key={cat} onClick={() => setCategoria(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                categoria === cat ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600 text-muted-foreground hover:border-gray-500'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Resultado */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {aulasFiltradas.length} resultado{aulasFiltradas.length !== 1 ? 's' : ''} {busca && `para "${busca}"`}
          </p>
          <Button onClick={() => setLocation('/carrinho')} variant="outline" className="flex items-center gap-2 border-purple-300 text-purple-600">
            <ShoppingCart className="w-4 h-4" />
            {carrinhoIds.length > 0 && <span className="bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{carrinhoIds.length}</span>}
            Carrinho
          </Button>
        </div>

        {/* Grid de cursos */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-muted rounded-xl animate-pulse h-72" />)}
          </div>
        ) : aulasFiltradas.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-14 h-14 mx-auto mb-4" />
            <p className="font-semibold text-lg">Nenhum curso encontrado</p>
            <p className="text-sm">Tente buscar por outro termo ou categoria</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aulasFiltradas.map(aula => {
              const v = getVideo(aula.titulo);
              const noCarrinho = carrinhoIds.includes(String(aula.id));
              return (
                <div key={aula.id} className="bg-card border rounded-xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer" onClick={() => setSelected(aula)}>
                  {/* Thumbnail */}
                  <div className="relative" style={{ paddingBottom: '56.25%' }}>
                    <img src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`} alt={aula.titulo} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                        <Play className="w-5 h-5 text-purple-600 fill-purple-600 ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">{v.categoria}</div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">{v.duracao}</div>
                  </div>

                  <div className="p-3">
                    <h3 className="font-bold text-sm mb-0.5 line-clamp-2 leading-snug">{aula.titulo}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{v.instrutor}</p>

                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-xs font-bold text-yellow-600">{v.rating}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= Math.round(Number(v.rating)) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">({v.alunos})</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <span className="bg-muted px-1.5 py-0.5 rounded">{v.nivel}</span>
                      <span>·</span>
                      <span>{v.duracao}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-600">R$ {(aula.preco ?? 99.90).toFixed(2)}</span>
                      <Button size="sm" onClick={e => { e.stopPropagation(); handleAddCarrinho(aula); }}
                        disabled={noCarrinho}
                        className={`text-xs h-7 px-2 ${noCarrinho ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'}`}>
                        {noCarrinho ? '✓ Adicionado' : '+ Carrinho'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Banner cupom */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div>
            <p className="text-xl font-bold">🏷️ Cupom especial hoje</p>
            <p className="text-purple-100 text-sm">Use o cupom <strong className="bg-white/20 px-2 py-0.5 rounded font-mono">JAUM</strong> no checkout e ganhe 100% de desconto em qualquer curso!</p>
          </div>
          <Button onClick={() => setLocation('/carrinho')} className="bg-white text-purple-700 hover:bg-gray-100 font-bold shrink-0">
            Ir para o checkout →
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
