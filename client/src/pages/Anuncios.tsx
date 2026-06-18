import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingCart, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Aula {
  id: number;
  titulo: string;
  descricao: string;
}

export default function Anuncios() {
  const [, setLocation] = useLocation();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/anuncios')
      .then(r => r.json())
      .then(data => { setAulas(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleAddCarrinho = (aula: Aula) => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const jaExiste = carrinho.find((i: any) => i.id === String(aula.id));

    if (jaExiste) {
      toast.error('Este item já está no carrinho');
      return;
    }

    carrinho.push({
      id: String(aula.id),
      titulo: aula.titulo,
      descricao: aula.descricao,
      preco: 99.90,
    });

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    toast.success(`"${aula.titulo}" adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Anúncios disponíveis</h1>
          <Button
            onClick={() => setLocation('/carrinho')}
            variant="outline"
            className="flex items-center gap-2 border-purple-300 text-purple-600 hover:bg-purple-50"
          >
            <ShoppingCart className="w-4 h-4" />
            Ver carrinho
          </Button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Carregando anúncios...</p>
        ) : aulas.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <BookOpen className="w-10 h-10" />
              <p className="text-sm">Nenhum anúncio disponível no momento.</p>
              <p className="text-xs text-gray-400">Cadastre aulas pelo banco para que apareçam aqui.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {aulas.map(aula => (
              <Card key={aula.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="py-5 px-5">
                  <div className="w-full h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{aula.titulo}</h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{aula.descricao}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-600">R$ 99,90</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddCarrinho(aula)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
