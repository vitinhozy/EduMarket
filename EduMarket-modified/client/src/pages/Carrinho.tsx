import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Navigation } from '@/components/Navigation';
import { PageWrapper } from '@/components/PageWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '@/contexts/LangContext';

interface ItemCarrinho { id: string; titulo: string; descricao: string; preco: number; }

export default function Carrinho() {
  const { t } = useLang();
  const [, setLocation] = useLocation();
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { setLocation('/login'); return; }
    const carrinho = localStorage.getItem('carrinho');
    if (carrinho) setItens(JSON.parse(carrinho));
  }, []);

  const handleRemover = (id: string) => {
    const novos = itens.filter(i => i.id !== id);
    setItens(novos);
    localStorage.setItem('carrinho', JSON.stringify(novos));
    toast.success(t('cart_removed'));
  };

  const total = itens.reduce((acc, i) => acc + i.preco, 0);

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
  );
}
