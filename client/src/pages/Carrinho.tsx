import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
<<<<<<< HEAD
=======
import { PageWrapper } from '@/components/PageWrapper';
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
<<<<<<< HEAD

interface ItemCarrinho {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
}

export default function Carrinho() {
  const [, setLocation] = useLocation();
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [usuario, setUsuario] = useState<any>(null);
  const [pagando, setPagando] = useState(false);
=======
import { useLang } from '@/contexts/LangContext';

interface ItemCarrinho { id: string; titulo: string; descricao: string; preco: number; }

export default function Carrinho() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
<<<<<<< HEAD
    setUsuario(JSON.parse(stored));

=======
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho) setItens(JSON.parse(carrinho));
  }, []);

  const handleRemover = (id: string) => {
    const novos = itens.filter(i => i.id !== id);
    setItens(novos);
    localStorage.setItem('carrinho', JSON.stringify(novos));
<<<<<<< HEAD
    toast.success('Item removido do carrinho');
=======
    toast.success(t('cart_removed'));
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  };

  const total = itens.reduce((acc, i) => acc + i.preco, 0);

<<<<<<< HEAD
  const handlePagar = async () => {
    if (itens.length === 0) return;
    setPagando(true);

    await new Promise(r => setTimeout(r, 1500));

    // Salvar notificação
    const notifs = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    itens.forEach(item => {
      notifs.unshift({
        id: Date.now() + Math.random(),
        titulo: 'Pagamento confirmado!',
        mensagem: `Sua compra de "${item.titulo}" foi confirmada com sucesso.`,
        data: new Date().toLocaleDateString('pt-BR'),
        lida: false,
      });
    });
    localStorage.setItem('notificacoes', JSON.stringify(notifs));

    // Limpar carrinho
    localStorage.setItem('carrinho', JSON.stringify([]));
    setItens([]);
    setPagando(false);

    toast.success('Pagamento realizado com sucesso! Verifique suas notificações.');
    setTimeout(() => setLocation('/notificacoes'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Carrinho</h1>

        {itens.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <ShoppingCart className="w-10 h-10" />
              <p className="text-sm">Seu carrinho está vazio.</p>
              <Button
                onClick={() => setLocation('/anuncios')}
                className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              >
                Ver anúncios disponíveis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {itens.map(item => (
              <Card key={item.id} className="shadow-sm">
                <CardContent className="py-4 px-5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.titulo}</p>
                    <p className="text-xs text-gray-500 truncate">{item.descricao}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-purple-600">
                      R$ {item.preco.toFixed(2)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemover(item.id)}
                      className="border-red-300 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="shadow-md border-purple-100">
              <CardContent className="py-5 px-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-purple-600">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={handlePagar}
                  disabled={pagando}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  {pagando ? 'Processando pagamento...' : 'Finalizar compra'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
=======
  const handlePagar = () => {
    if (!itens.length) return;
    setLocation('/payment');
  };

  return (
    <PageWrapper>
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">{t('cart_title')}</h1>
        {itens.length === 0 ? (
          <Card><CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <ShoppingCart className="w-10 h-10" />
            <p className="text-sm">{t('cart_empty')}</p>
            <Button onClick={() => setLocation('/anuncios')} className="mt-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white">{t('cart_browse')}</Button>
          </CardContent></Card>
        ) : (
          <div className="space-y-4">
            {itens.map(item => (
              <Card key={item.id}><CardContent className="py-4 px-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{item.titulo}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.descricao}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-purple-600">R$ {item.preco.toFixed(2)}</span>
                  <Button variant="outline" size="sm" onClick={() => handleRemover(item.id)} className="border-red-300 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent></Card>
            ))}
            <Card className="border-purple-100"><CardContent className="py-5 px-5">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">{t('cart_total')}</span>
                <span className="text-2xl font-bold text-purple-600">R$ {total.toFixed(2)}</span>
              </div>
              <Button onClick={handlePagar} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />{t('cart_checkout')}
              </Button>
            </CardContent></Card>
          </div>
        )}
      </div>
    </PageWrapper>
>>>>>>> 8e5be9631f93ecca59ce4d7f87e6cee7daaa9328
  );
}
